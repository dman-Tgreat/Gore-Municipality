import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let service: DepartmentsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockDepartment = {
    id: 1,
    name: 'Health Bureau',
    description: 'Responsible for public health',
    head: 'Dr. Alemu',
    phone: '+251911234567',
    email: 'health@gore.gov.et',
    office: 'Main Building Room 12',
    image: null,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [
        DepartmentsService,
        {
          provide: getRepositoryToken(Department),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
    service = module.get<DepartmentsService>(DepartmentsService);
  });

  describe('create', () => {
    it('should create a department', async () => {
      const dto = {
        name: 'Health Bureau',
        description: 'Desc',
        head: 'Dr. Alemu',
        phone: '+251911234567',
        email: 'health@gore.gov.et',
        office: 'Room 12',
      };
      jest.spyOn(service, 'create').mockResolvedValue(mockDepartment as any);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockDepartment);
    });
  });

  describe('findAll', () => {
    it('should return all departments', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockDepartment] as any);

      const result = await controller.findAll();

      expect(result).toEqual([mockDepartment]);
    });
  });

  describe('findOne', () => {
    it('should return a department by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDepartment as any);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDepartment);
    });
  });

  describe('update', () => {
    it('should update a department', async () => {
      const dto = { name: 'Updated' };
      jest.spyOn(service, 'update').mockResolvedValue({ ...mockDepartment, name: 'Updated' } as any);

      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result.name).toBe('Updated');
    });
  });

  describe('remove', () => {
    it('should delete a department', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ message: 'Department deleted successfully' });

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Department deleted successfully' });
    });
  });
});
