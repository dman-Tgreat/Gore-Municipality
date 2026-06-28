import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { Admin } from '../admin/entities/admin.entity';

describe('NewsController', () => {
  let controller: NewsController;
  let service: NewsService;

  const mockNewsRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const mockAdminRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  const mockNews = {
    id: 1, title: 'Test News', slug: 'test-news', summary: 'Summary', content: 'Content',
    coverImage: null, published: true,
    createdBy: { id: 1, fullName: 'Admin', email: 'admin@gore.gov.et' },
    createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        NewsService,
        { provide: getRepositoryToken(News), useValue: mockNewsRepo },
        { provide: getRepositoryToken(Admin), useValue: mockAdminRepo },
      ],
    }).compile();

    controller = module.get<NewsController>(NewsController);
    service = module.get<NewsService>(NewsService);
  });

  describe('create', () => {
    it('should create news with req.user.id', async () => {
      const dto = { title: 'Test', slug: 'test', summary: 'Sum', content: 'Content' };
      const req = { user: { id: 1 } };
      jest.spyOn(service, 'create').mockResolvedValue(mockNews as any);

      const result = await controller.create(req as any, dto);

      expect(service.create).toHaveBeenCalledWith(dto, 1);
      expect(result).toEqual(mockNews);
    });
  });

  describe('findAll', () => {
    it('should return all news', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockNews] as any);

      const result = await controller.findAll();
      expect(result).toEqual([mockNews]);
    });
  });

  describe('findOne', () => {
    it('should return news by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockNews as any);

      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockNews);
    });
  });

  describe('update', () => {
    it('should update news', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockNews as any);

      const result = await controller.update('1', { title: 'Updated' });
      expect(service.update).toHaveBeenCalledWith(1, { title: 'Updated' });
      expect(result).toEqual(mockNews);
    });
  });

  describe('remove', () => {
    it('should delete news', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ message: 'News deleted successfully' });

      const result = await controller.remove('1');
      expect(result).toEqual({ message: 'News deleted successfully' });
    });
  });
});
