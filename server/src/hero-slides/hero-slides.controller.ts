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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HeroSlidesService } from './hero-slides.service';
import { CreateHeroSlideDto } from './dto/create-hero-slide.dto';
import { UpdateHeroSlideDto } from './dto/update-hero-slide.dto';

@ApiTags('Hero Slides')
@Controller('hero-slides')
export class HeroSlidesController {
  constructor(private readonly heroSlidesService: HeroSlidesService) {}

  @Get()
  @ApiOperation({ summary: 'List all hero slides' })
  @ApiResponse({ status: 200, description: 'Returns all hero slides' })
  findAll() {
    return this.heroSlidesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'List active hero slides only' })
  @ApiResponse({ status: 200, description: 'Returns active hero slides' })
  findActive() {
    return this.heroSlidesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hero slide by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the hero slide' })
  @ApiResponse({ status: 404, description: 'Hero slide not found' })
  findOne(@Param('id') id: string) {
    return this.heroSlidesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a hero slide' })
  @ApiResponse({ status: 201, description: 'Hero slide created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createDto: CreateHeroSlideDto) {
    return this.heroSlidesService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a hero slide' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Hero slide updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateDto: UpdateHeroSlideDto) {
    return this.heroSlidesService.update(+id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a hero slide' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Hero slide deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.heroSlidesService.remove(+id);
  }
}
