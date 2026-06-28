import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { Admin } from '../admin/entities/admin.entity';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  const mockProjectRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const mockAdminRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  const mockProject = {
    id: 1, name: 'Road Construction', description: 'Building roads',
    budget: 500000, status: 'ongoing', location: 'Gore Town',
    createdBy: { id: 1, fullName: 'Admin', email: 'admin@gore.gov.et' },
    createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: mockProjectRepo },
        { provide: getRepositoryToken(Admin), useValue: mockAdminRepo },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); });

  describe('create', () => {
    it('should create with req.user.id', async () => {
      const dto = { name: 'Road', description: 'Building' };
      jest.spyOn(service, 'create').mockResolvedValue(mockProject as any);
      const result = await controller.create({ user: { id: 1 } } as any, dto);
      expect(service.create).toHaveBeenCalledWith(dto, 1);
      expect(result).toEqual(mockProject);
    });
  });

  describe('findAll', () => {
    it('should return all', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockProject] as any);
      expect(await controller.findAll()).toEqual([mockProject]);
    });
  });

  describe('findOne', () => {
    it('should return by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProject as any);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProject);
    });
  });

  describe('update', () => {
    it('should update', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockProject as any);
      expect(await controller.update('1', { name: 'Updated' })).toEqual(mockProject);
    });
  });

  describe('remove', () => {
    it('should delete', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ message: 'Project deleted successfully' });
      expect(await controller.remove('1')).toEqual({ message: 'Project deleted successfully' });
    });
  });
});
