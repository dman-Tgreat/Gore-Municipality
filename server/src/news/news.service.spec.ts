import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { Admin } from '../admin/entities/admin.entity';

describe('NewsService', () => {
  let service: NewsService;
  let newsRepo: any;
  let adminRepo: any;

  const mockNewsRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const mockAdminRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  const mockAdmin = { id: 1, fullName: 'Admin', email: 'admin@gore.gov.et' } as Admin;
  const mockNews: News = {
    id: 1, title: 'Test News', slug: 'test-news', summary: 'Summary', content: 'Content',
    coverImage: '/uploads/img.jpg', published: true, createdBy: mockAdmin,
    createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'),
  };

  const createDto = { title: 'Test News', slug: 'test-news', summary: 'Summary', content: 'Content' };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NewsService,
        { provide: getRepositoryToken(News), useValue: mockNewsRepo },
        { provide: getRepositoryToken(Admin), useValue: mockAdminRepo },
      ],
    }).compile();

    service = module.get<NewsService>(NewsService);
    newsRepo = mockNewsRepo;
    adminRepo = mockAdminRepo;
  });

  describe('create', () => {
    it('should create news with admin as creator', async () => {
      adminRepo.findOne.mockResolvedValue(mockAdmin);
      newsRepo.create.mockReturnValue(mockNews);
      newsRepo.save.mockResolvedValue(mockNews);

      const result = await service.create(createDto, 1);

      expect(adminRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(newsRepo.create).toHaveBeenCalledWith({ ...createDto, createdBy: mockAdmin });
      expect(newsRepo.save).toHaveBeenCalledWith(mockNews);
      expect(result).toEqual(mockNews);
    });

    it('should throw NotFoundException when admin not found', async () => {
      adminRepo.findOne.mockResolvedValue(null);

      await expect(service.create(createDto, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all news with createdBy relation', async () => {
      newsRepo.find.mockResolvedValue([mockNews]);

      const result = await service.findAll();

      expect(newsRepo.find).toHaveBeenCalledWith({
        relations: { createdBy: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockNews]);
    });
  });

  describe('findOne', () => {
    it('should return news by id', async () => {
      newsRepo.findOne.mockResolvedValue(mockNews);

      const result = await service.findOne(1);

      expect(result).toEqual(mockNews);
    });

    it('should throw NotFoundException', async () => {
      newsRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return news', async () => {
      newsRepo.update.mockResolvedValue({ affected: 1 } as any);
      newsRepo.findOne.mockResolvedValue(mockNews);

      const result = await service.update(1, { title: 'Updated' });

      expect(newsRepo.update).toHaveBeenCalledWith(1, { title: 'Updated' });
      expect(result).toEqual(mockNews);
    });
  });

  describe('remove', () => {
    it('should delete and return success message', async () => {
      newsRepo.findOne.mockResolvedValue(mockNews);
      newsRepo.remove.mockResolvedValue(mockNews);

      const result = await service.remove(1);

      expect(newsRepo.remove).toHaveBeenCalledWith(mockNews);
      expect(result).toEqual({ message: 'News deleted successfully' });
    });
  });
});
