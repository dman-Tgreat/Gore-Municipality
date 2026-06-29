import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroSlidesController } from './hero-slides.controller';
import { HeroSlidesService } from './hero-slides.service';
import { HeroSlide } from './entities/hero-slide.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HeroSlide])],
  controllers: [HeroSlidesController],
  providers: [HeroSlidesService],
})
export class HeroSlidesModule {}
