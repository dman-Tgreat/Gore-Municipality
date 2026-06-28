import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { Admin } from '../admin/entities/admin.entity';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const mockAdminRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  const mockDocument = {
    id: 1, title: 'Policy Doc', description: 'Desc', fileUrl: '/uploads/doc.pdf', category: 'Policy',
    createdBy: { id: 1, fullName: 'Admin', email: 'admin@gore.gov.et' },
    createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        DocumentsService,
        { provide: getRepositoryToken(Document), useValue: mockDocRepo },
        { provide: getRepositoryToken(Admin), useValue: mockAdminRepo },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); });

  describe('create', () => {
    it('should create with req.user.id', async () => {
      const dto = { title: 'Doc', description: 'Desc', fileUrl: '/uploads/doc.pdf', category: 'Policy' };
      jest.spyOn(service, 'create').mockResolvedValue(mockDocument as any);
      const result = await controller.create({ user: { id: 1 } } as any, dto);
      expect(service.create).toHaveBeenCalledWith(dto, 1);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('findAll', () => {
    it('should return all', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockDocument] as any);
      expect(await controller.findAll()).toEqual([mockDocument]);
    });
  });

  describe('findOne', () => {
    it('should return by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockDocument as any);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('update', () => {
    it('should update', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockDocument as any);
      expect(await controller.update('1', { title: 'Updated' })).toEqual(mockDocument);
    });
  });

  describe('remove', () => {
    it('should delete', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ message: 'Document deleted successfully' });
      expect(await controller.remove('1')).toEqual({ message: 'Document deleted successfully' });
    });
  });
});
