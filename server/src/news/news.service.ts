import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { News } from './entities/news.entity';

import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { Admin } from '../admin/entities/admin.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 255);
  }

  async create(
    createNewsDto: CreateNewsDto,
    adminId: number,
  ) {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Auto-generate slug from title if not provided
    const slug = createNewsDto.slug || this.generateSlug(createNewsDto.title);

    const news = this.newsRepository.create({
      ...createNewsDto,
      slug,
      createdBy: admin,
    });

    return await this.newsRepository.save(news);
  }
  async findAll() {
    return await this.newsRepository.find({
      relations: {
        createdBy:true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: {
        createdBy:true
      },
    });

    if (!news) {
      throw new NotFoundException('News not found');
    }

    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    await this.newsRepository.update(id, updateNewsDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    const news = await this.findOne(id);

    await this.newsRepository.remove(news);

    return {
      message: 'News deleted successfully',
    };
  }
}