import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HeroSlidesService } from './hero-slides.service';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';

@Controller('hero-slides')
export class HeroSlidesController {
  constructor(private readonly heroSlidesService: HeroSlidesService) {}

  @Get()
  findAll() {
    return this.heroSlidesService.findAll();
  }

  @Get('active')
  findActive() {
    return this.heroSlidesService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.heroSlidesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDto: CreateHeroSlideDto) {
    return this.heroSlidesService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateHeroSlideDto) {
    return this.heroSlidesService.update(+id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.heroSlidesService.remove(+id);
  }
}
