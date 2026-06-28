import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockAdmin = {
    id: 1,
    fullName: 'Admin User',
    email: 'admin@gore.gov.et',
    password: '$2b$10$hash',
    isActive: true,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        AdminService,
        { provide: getRepositoryToken(Admin), useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  describe('create', () => {
    it('should create an admin', async () => {
      const dto = { fullName: 'New', email: 'new@gore.gov.et', password: 'password123' };
      jest.spyOn(service, 'create').mockResolvedValue(mockAdmin as any);

      const result = await controller.create(dto);
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('findAll', () => {
    it('should return all admins', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockAdmin] as any);

      const result = await controller.findAll();
      expect(result).toEqual([mockAdmin]);
    });
  });

  describe('findOne', () => {
    it('should return an admin by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockAdmin as any);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('update', () => {
    it('should update an admin', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockAdmin as any);

      const result = await controller.update('1', { fullName: 'Updated' });
      expect(service.update).toHaveBeenCalledWith(1, { fullName: 'Updated' });
      expect(result).toEqual(mockAdmin);
    });
  });

  describe('remove', () => {
    it('should delete an admin', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ message: 'Admin deleted successfully' });

      const result = await controller.remove('1');
      expect(result).toEqual({ message: 'Admin deleted successfully' });
    });
  });
});
