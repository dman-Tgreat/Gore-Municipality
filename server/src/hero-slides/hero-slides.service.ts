import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeroSlide } from './entities/hero-slide.entity';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';

@Injectable()
export class HeroSlidesService {
  constructor(
    @InjectRepository(HeroSlide)
    private readonly heroSlideRepository: Repository<HeroSlide>,
  ) {}

  async create(createDto: CreateHeroSlideDto): Promise<HeroSlide> {
    const slide = this.heroSlideRepository.create(createDto);
    return this.heroSlideRepository.save(slide);
  }

  async findAll(): Promise<HeroSlide[]> {
    return this.heroSlideRepository.find({
      order: { sortOrder: 'ASC' },
    });
  }

  async findActive(): Promise<HeroSlide[]> {
    return this.heroSlideRepository.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: number): Promise<HeroSlide> {
    const slide = await this.heroSlideRepository.findOne({ where: { id } });
    if (!slide) {
      throw new NotFoundException(`Hero slide with id ${id} not found`);
    }
    return slide;
  }

  async update(id: number, updateDto: UpdateHeroSlideDto): Promise<HeroSlide> {
    const slide = await this.findOne(id);
    Object.assign(slide, updateDto);
    return this.heroSlideRepository.save(slide);
  }

  async remove(id: number): Promise<{ message: string }> {
    const slide = await this.findOne(id);
    await this.heroSlideRepository.remove(slide);
    return { message: `Hero slide #${id} deleted successfully` };
  }
}
