import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { Admin } from '../admin/entities/admin.entity';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let docRepo: any;
  let adminRepo: any;

  const mockDocRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const mockAdminRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  const mockAdmin = { id: 1, fullName: 'Admin', email: 'admin@gore.gov.et' } as Admin;
  const mockDocument: Document = {
    id: 1, title: 'Policy Doc', description: 'Desc', fileUrl: '/uploads/doc.pdf', category: 'Policy',
    createdBy: mockAdmin, createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'),
  };

  const createDto = { title: 'Policy Doc', description: 'Desc', fileUrl: '/uploads/doc.pdf', category: 'Policy' };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: getRepositoryToken(Document), useValue: mockDocRepo },
        { provide: getRepositoryToken(Admin), useValue: mockAdminRepo },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    docRepo = mockDocRepo;
    adminRepo = mockAdminRepo;
  });

  describe('create', () => {
    it('should create document with admin as creator', async () => {
      adminRepo.findOne.mockResolvedValue(mockAdmin);
      docRepo.create.mockReturnValue(mockDocument);
      docRepo.save.mockResolvedValue(mockDocument);

      const result = await service.create(createDto, 1);

      expect(adminRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(docRepo.create).toHaveBeenCalledWith({ ...createDto, createdBy: mockAdmin });
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException when admin not found', async () => {
      adminRepo.findOne.mockResolvedValue(null);
      await expect(service.create(createDto, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      docRepo.find.mockResolvedValue([mockDocument]);
      const result = await service.findAll();
      expect(docRepo.find).toHaveBeenCalledWith({
        relations: { createdBy: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockDocument]);
    });
  });

  describe('findOne', () => {
    it('should return by id', async () => {
      docRepo.findOne.mockResolvedValue(mockDocument);
      expect(await service.findOne(1)).toEqual(mockDocument);
    });
    it('should throw NotFoundException', async () => {
      docRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return document', async () => {
      docRepo.update.mockResolvedValue({ affected: 1 } as any);
      docRepo.findOne.mockResolvedValue(mockDocument);
      expect(await service.update(1, { title: 'Updated' })).toEqual(mockDocument);
    });
  });

  describe('remove', () => {
    it('should delete and return success message', async () => {
      docRepo.findOne.mockResolvedValue(mockDocument);
      docRepo.remove.mockResolvedValue(mockDocument);
      expect(await service.remove(1)).toEqual({ message: 'Document deleted successfully' });
    });
  });
});
