import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';
import { Admin } from '../admin/entities/admin.entity';

describe('AnnouncementsController', () => {
  let controller: AnnouncementsController;
  let service: AnnouncementsService;

  const mockAnnRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const mockAdminRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  const mockAnnouncement = {
    id: 1, title: 'Notice', description: 'Desc', content: 'Content',
    published: true,
    createdBy: { id: 1, fullName: 'Admin', email: 'admin@gore.gov.et' },
    createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnnouncementsController],
      providers: [
        AnnouncementsService,
        { provide: getRepositoryToken(Announcement), useValue: mockAnnRepo },
        { provide: getRepositoryToken(Admin), useValue: mockAdminRepo },
      ],
    }).compile();

    controller = module.get<AnnouncementsController>(AnnouncementsController);
    service = module.get<AnnouncementsService>(AnnouncementsService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); });

  describe('create', () => {
    it('should create announcement with req.user.id', async () => {
      const dto = { title: 'Notice', description: 'Desc', content: 'Content' };
      jest.spyOn(service, 'create').mockResolvedValue(mockAnnouncement as any);

      const result = await controller.create({ user: { id: 1 } } as any, dto);
      expect(service.create).toHaveBeenCalledWith(dto, 1);
      expect(result).toEqual(mockAnnouncement);
    });
  });

  describe('findAll', () => {
    it('should return all announcements', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([mockAnnouncement] as any);
      expect(await controller.findAll()).toEqual([mockAnnouncement]);
    });
  });

  describe('findOne', () => {
    it('should return by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockAnnouncement as any);
      const result = await controller.findOne('1');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAnnouncement);
    });
  });

  describe('update', () => {
    it('should update', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(mockAnnouncement as any);
      const result = await controller.update('1', { title: 'Updated' });
      expect(service.update).toHaveBeenCalledWith(1, { title: 'Updated' });
      expect(result).toEqual(mockAnnouncement);
    });
  });

  describe('remove', () => {
    it('should delete', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue({ message: 'Announcement deleted successfully' });
      expect(await controller.remove('1')).toEqual({ message: 'Announcement deleted successfully' });
    });
  });
});
