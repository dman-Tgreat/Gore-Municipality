import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import { NewsService } from './news.service';

import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a news article' })
  @ApiResponse({ status: 201, description: 'News article created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Req() req: any,
    @Body() dto: CreateNewsDto,
  ) {
    return this.newsService.create(dto, req.user.id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List all news articles' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'published', required: false, type: Boolean, description: 'Filter by published status (ignored for anonymous requests, which always see published only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated or full list of news articles' })
  findAll(
    @Req() req: any,
    @Query() query: PaginationQueryDto & { published?: string },
  ) {
    // Anonymous visitors only ever see published articles;
    // authenticated admins can filter or see everything.
    const published = req.user
      ? query.published === 'true'
        ? true
        : query.published === 'false'
          ? false
          : undefined
      : true;

    return this.newsService.findAll(query.page, query.limit, published);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a news article by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'News article ID' })
  @ApiResponse({ status: 200, description: 'Returns the news article' })
  @ApiResponse({ status: 404, description: 'News not found' })
  findOne(@Req() req: any, @Param('id') id: string) {
    // Drafts are hidden from anonymous visitors.
    return this.newsService.findOne(+id, !req.user);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a news article' })
  @ApiParam({ name: 'id', type: Number, description: 'News article ID' })
  @ApiResponse({ status: 200, description: 'News article updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'News not found' })
  update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a news article' })
  @ApiParam({ name: 'id', type: Number, description: 'News article ID' })
  @ApiResponse({ status: 200, description: 'News article deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'News not found' })
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
