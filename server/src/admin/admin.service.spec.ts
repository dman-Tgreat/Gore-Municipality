import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('$2b$10$hashedpassword'),
}));

describe('AdminService', () => {
  let service: AdminService;
  let repository: any;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAdmin: Admin = {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@gore.gov.et',
    password: '$2b$10$hashedpassword',
    isActive: true,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  };

  const createDto = {
    fullName: 'New Admin',
    email: 'new@gore.gov.et',
    password: 'password123',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    repository = mockRepository;
  });

  describe('findByEmail', () => {
    it('should find admin by email', async () => {
      repository.findOne.mockResolvedValue(mockAdmin);

      const result = await service.findByEmail('admin@gore.gov.et');

      expect(repository.findOne).toHaveBeenCalledWith({ where: { email: 'admin@gore.gov.et' } });
      expect(result).toEqual(mockAdmin);
    });

    it('should return null when email not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@gore.gov.et');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should hash password and create admin', async () => {
      repository.create.mockReturnValue(mockAdmin);
      repository.save.mockResolvedValue(mockAdmin);

      const result = await service.create(createDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        password: '$2b$10$hashedpassword',
      });
      expect(repository.save).toHaveBeenCalledWith(mockAdmin);
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('findAll', () => {
    it('should return all admins ordered by createdAt DESC', async () => {
      repository.find.mockResolvedValue([mockAdmin]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockAdmin]);
    });
  });

  describe('findOne', () => {
    it('should return an admin by id', async () => {
      repository.findOne.mockResolvedValue(mockAdmin);

      const result = await service.findOne(1);

      expect(result).toEqual(mockAdmin);
    });

    it('should throw NotFoundException when admin does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should hash new password when updating password', async () => {
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue(mockAdmin);

      const result = await service.update(1, { fullName: 'Updated Name' });

      expect(repository.update).toHaveBeenCalledWith(1, { fullName: 'Updated Name' });
      expect(result).toEqual(mockAdmin);
    });

    it('should hash password when password is provided', async () => {
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue(mockAdmin);

      await service.update(1, { password: 'newpass123' });

      expect(bcrypt.hash).toHaveBeenCalledWith('newpass123', 10);
      expect(repository.update).toHaveBeenCalledWith(1, {
        password: '$2b$10$hashedpassword',
      });
    });

    it('should throw NotFoundException for non-existent admin', async () => {
      repository.update.mockResolvedValue({ affected: 0 } as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { fullName: 'Nope' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete and return success message', async () => {
      repository.findOne.mockResolvedValue(mockAdmin);
      repository.remove.mockResolvedValue(mockAdmin);

      const result = await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(mockAdmin);
      expect(result).toEqual({ message: 'Admin deleted successfully' });
    });

    it('should throw NotFoundException for non-existent admin', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
