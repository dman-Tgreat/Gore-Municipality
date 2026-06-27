import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementsRepository: Repository<Announcement>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
    adminId: number,
  ) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const announcement = this.announcementsRepository.create({
      ...createAnnouncementDto,
      createdBy: admin,
    });

    return await this.announcementsRepository.save(announcement);
  }

  async findAll() {
    return await this.announcementsRepository.find({
      relations: {
        createdBy: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const announcement = await this.announcementsRepository.findOne({
      where: { id },
      relations: {
        createdBy: true,
      },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
    await this.announcementsRepository.update(id, updateAnnouncementDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    const announcement = await this.findOne(id);

    await this.announcementsRepository.remove(announcement);

    return {
      message: 'Announcement deleted successfully',
    };
  }
}
