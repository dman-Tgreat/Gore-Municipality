import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';
import { Admin } from '../admin/entities/admin.entity';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let announcementRepo: any;
  let adminRepo: any;

  const mockAnnRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };
  const mockAdminRepo = { create: jest.fn(), save: jest.fn(), find: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  const mockAdmin = { id: 1, fullName: 'Admin', email: 'admin@gore.gov.et' } as Admin;
  const mockAnnouncement: Announcement = {
    id: 1, title: 'Notice', description: 'Desc', content: 'Content',
    published: true, createdBy: mockAdmin,
    createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15'),
  };

  const createDto = { title: 'Notice', description: 'Desc', content: 'Content' };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        { provide: getRepositoryToken(Announcement), useValue: mockAnnRepo },
        { provide: getRepositoryToken(Admin), useValue: mockAdminRepo },
      ],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
    announcementRepo = mockAnnRepo;
    adminRepo = mockAdminRepo;
  });

  describe('create', () => {
    it('should create announcement with admin as creator', async () => {
      adminRepo.findOne.mockResolvedValue(mockAdmin);
      announcementRepo.create.mockReturnValue(mockAnnouncement);
      announcementRepo.save.mockResolvedValue(mockAnnouncement);

      const result = await service.create(createDto, 1);

      expect(adminRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(announcementRepo.create).toHaveBeenCalledWith({ ...createDto, createdBy: mockAdmin });
      expect(result).toEqual(mockAnnouncement);
    });

    it('should throw NotFoundException when admin not found', async () => {
      adminRepo.findOne.mockResolvedValue(null);
      await expect(service.create(createDto, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all announcements', async () => {
      announcementRepo.find.mockResolvedValue([mockAnnouncement]);

      const result = await service.findAll();

      expect(announcementRepo.find).toHaveBeenCalledWith({
        relations: { createdBy: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockAnnouncement]);
    });
  });

  describe('findOne', () => {
    it('should return announcement by id', async () => {
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);

      const result = await service.findOne(1);
      expect(result).toEqual(mockAnnouncement);
    });

    it('should throw NotFoundException', async () => {
      announcementRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return announcement', async () => {
      announcementRepo.update.mockResolvedValue({ affected: 1 } as any);
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);

      const result = await service.update(1, { title: 'Updated' });
      expect(result).toEqual(mockAnnouncement);
    });
  });

  describe('remove', () => {
    it('should delete and return success message', async () => {
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);
      announcementRepo.remove.mockResolvedValue(mockAnnouncement);

      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Announcement deleted successfully' });
    });
  });
});
