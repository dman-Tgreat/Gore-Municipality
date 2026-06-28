import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { Admin } from '../admin/entities/admin.entity';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepo: any;
  let adminRepo: any;

  const mockProjectRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const mockAdminRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  const mockAdmin = { id: 1, fullName: 'Admin', email: 'admin@gore.gov.et' } as Admin;
  const mockProject: Project = {
    id: 1, name: 'Road Construction', description: 'Building roads',
    budget: 500000, status: 'ongoing', startDate: '2026-01-01', endDate: '2026-06-30',
    location: 'Gore Town', coverImage: '', fundingSource: 'Government', contractor: 'ABC Co.', category: 'Infrastructure',
    createdBy: mockAdmin, createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'),
  };

  const createDto = { name: 'Road Construction', description: 'Building roads' };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: mockProjectRepo },
        { provide: getRepositoryToken(Admin), useValue: mockAdminRepo },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectRepo = mockProjectRepo;
    adminRepo = mockAdminRepo;
  });

  describe('create', () => {
    it('should create project with admin as creator', async () => {
      adminRepo.findOne.mockResolvedValue(mockAdmin);
      projectRepo.create.mockReturnValue(mockProject);
      projectRepo.save.mockResolvedValue(mockProject);

      const result = await service.create(createDto, 1);

      expect(adminRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(projectRepo.create).toHaveBeenCalledWith({ ...createDto, createdBy: mockAdmin });
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException when admin not found', async () => {
      adminRepo.findOne.mockResolvedValue(null);
      await expect(service.create(createDto, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      projectRepo.find.mockResolvedValue([mockProject]);
      const result = await service.findAll();
      expect(projectRepo.find).toHaveBeenCalledWith({
        relations: { createdBy: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockProject]);
    });
  });

  describe('findOne', () => {
    it('should return project by id', async () => {
      projectRepo.findOne.mockResolvedValue(mockProject);
      expect(await service.findOne(1)).toEqual(mockProject);
    });

    it('should throw NotFoundException', async () => {
      projectRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return project', async () => {
      projectRepo.update.mockResolvedValue({ affected: 1 } as any);
      projectRepo.findOne.mockResolvedValue(mockProject);
      const result = await service.update(1, { name: 'Updated' });
      expect(result).toEqual(mockProject);
    });
  });

  describe('remove', () => {
    it('should delete and return success message', async () => {
      projectRepo.findOne.mockResolvedValue(mockProject);
      projectRepo.remove.mockResolvedValue(mockProject);
      expect(await service.remove(1)).toEqual({ message: 'Project deleted successfully' });
    });
  });
});
