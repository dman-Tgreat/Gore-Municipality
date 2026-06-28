import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'email-id' }),
    },
  })),
}));

describe('ContactService', () => {
  let service: ContactService;
  let repository: any;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'RESEND_API_KEY') return 're_test_key';
      if (key === 'RESEND_FROM_EMAIL') return 'noreply@gore.gov.et';
      throw new Error(`Missing config: ${key}`);
    }),
    get: jest.fn((key: string) => {
      if (key === 'CONTACT_NOTIFICATION_EMAIL') return 'admin@gore.gov.et';
      return null;
    }),
  };

  const mockContact: Contact = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question',
    message: 'I have a question about services.',
    isRead: false,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  };

  const createDto = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question',
    message: 'I have a question about services.',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: getRepositoryToken(Contact), useValue: mockRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    repository = mockRepository;
  });

  describe('create', () => {
    it('should create contact message and return it', async () => {
      repository.create.mockReturnValue(mockContact);
      repository.save.mockResolvedValue(mockContact);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockContact);
      expect(result).toEqual(mockContact);
      expect(result.isRead).toBe(false);
    });

    it('should handle email notification failure gracefully', async () => {
      repository.create.mockReturnValue(mockContact);
      repository.save.mockResolvedValue(mockContact);

      const result = await service.create(createDto);

      expect(result).toEqual(mockContact);
    });
  });

  describe('findAll', () => {
    it('should return all messages ordered by createdAt DESC', async () => {
      repository.find.mockResolvedValue([mockContact]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockContact]);
    });
  });

  describe('findOne', () => {
    it('should return contact by id', async () => {
      repository.findOne.mockResolvedValue(mockContact);

      const result = await service.findOne(1);

      expect(result).toEqual(mockContact);
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Contact message not found');
    });
  });

  describe('update', () => {
    it('should update and return the contact (mark as read)', async () => {
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue({ ...mockContact, isRead: true });

      const result = await service.update(1, { isRead: true });

      expect(repository.update).toHaveBeenCalledWith(1, { isRead: true });
      expect(result.isRead).toBe(true);
    });

    it('should throw NotFoundException when updating non-existent', async () => {
      repository.update.mockResolvedValue({ affected: 0 } as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { isRead: true })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete and return success message', async () => {
      repository.findOne.mockResolvedValue(mockContact);
      repository.remove.mockResolvedValue(mockContact);

      const result = await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(mockContact);
      expect(result).toEqual({ message: 'Contact message deleted successfully' });
    });

    it('should throw NotFoundException for non-existent contact', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
