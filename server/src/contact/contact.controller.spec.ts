import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';

describe('ContactController', () => {
  let controller: ContactController;
  let service: ContactService;

  const mockRepository = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'RESEND_API_KEY') return 're_test_key';
      if (key === 'RESEND_FROM_EMAIL') return 'noreply@gore.gov.et';
      throw new Error(`Missing config: ${key}`);
    }),
    get: jest.fn(() => 'admin@gore.gov.et'),
  };

  const mockContact = {
    id: 1, name: 'John', email: 'john@example.com', subject: 'Question', message: 'Hello',
    isRead: false,
    createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        ContactService,
        { provide: getRepositoryToken(Contact), useValue: mockRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
    service = module.get<ContactService>(ContactService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); });

  describe('create', () => {
    it('should create a contact message (public endpoint)', async () => {
      const dto = { name: 'John', email: 'john@example.com', subject: 'Question', message: 'Hello' };
      jest.spyOn(service, 'create').mockResolvedValue(mockContact as any);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockContact);
    });
  });

  describe('findAll', () => {
    it('should return all messages', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockContact] as any);
      expect(await controller.findAll()).toEqual([mockContact]);
    });
  });

  describe('findOne', () => {
    it('should return by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockContact as any);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockContact);
    });
  });

  describe('update', () => {
    it('should update (mark as read)', async () => {
      jest.spyOn(service, 'update').mockResolvedValue({ ...mockContact, isRead: true } as any);
      const result = await controller.update('1', { isRead: true });
      expect(service.update).toHaveBeenCalledWith(1, { isRead: true });
      expect(result.isRead).toBe(true);
    });
  });

  describe('remove', () => {
    it('should delete', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ message: 'Contact message deleted successfully' });
      expect(await controller.remove('1')).toEqual({ message: 'Contact message deleted successfully' });
    });
  });
});
