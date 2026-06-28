import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let repository: jest.Mocked<typeof mockRepository>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockDepartment: Department = {
    id: 1,
    name: 'Health Bureau',
    description: 'Responsible for public health',
    head: 'Dr. Alemu',
    phone: '+251911234567',
    email: 'health@gore.gov.et',
    office: 'Main Building Room 12',
    image: '/uploads/health.jpg',
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  };

  const createDto = {
    name: 'Health Bureau',
    description: 'Responsible for public health',
    head: 'Dr. Alemu',
    phone: '+251911234567',
    email: 'health@gore.gov.et',
    office: 'Main Building Room 12',
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: getRepositoryToken(Department),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    repository = mockRepository as any;
  });

  describe('create', () => {
    it('should create and return a department', async () => {
      repository.create.mockReturnValue(mockDepartment);
      repository.save.mockResolvedValue(mockDepartment);

      const result = await service.create(createDto);

      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(mockDepartment);
      expect(result).toEqual(mockDepartment);
    });
  });

  describe('findAll', () => {
    it('should return all departments ordered by createdAt DESC', async () => {
      repository.find.mockResolvedValue([mockDepartment]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockDepartment]);
    });

    it('should return empty array when no departments exist', async () => {
      repository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a department by id', async () => {
      repository.findOne.mockResolvedValue(mockDepartment);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockDepartment);
    });

    it('should throw NotFoundException when department does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Department not found');
    });
  });

  describe('update', () => {
    it('should update and return the updated department', async () => {
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue(mockDepartment);

      const result = await service.update(1, { name: 'Updated Name' });

      expect(repository.update).toHaveBeenCalledWith(1, { name: 'Updated Name' });
      expect(result).toEqual(mockDepartment);
    });

    it('should throw NotFoundException when updating non-existent department', async () => {
      repository.update.mockResolvedValue({ affected: 0 } as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Nope' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete and return success message', async () => {
      repository.findOne.mockResolvedValue(mockDepartment);
      repository.remove.mockResolvedValue(mockDepartment);

      const result = await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.remove).toHaveBeenCalledWith(mockDepartment);
      expect(result).toEqual({ message: 'Department deleted successfully' });
    });

    it('should throw NotFoundException when deleting non-existent department', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
