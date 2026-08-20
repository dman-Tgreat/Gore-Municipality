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
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { BulkUpsertSettingDto } from './dto/bulk-upsert-setting.dto';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all site settings' })
  @ApiResponse({ status: 200, description: 'Returns all settings' })
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Get a setting value by key' })
  @ApiParam({ name: 'key', type: String, description: 'Setting key (e.g. site_name)' })
  @ApiResponse({ status: 200, description: 'Returns the setting value' })
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a setting by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Returns the setting' })
  @ApiResponse({ status: 404, description: 'Setting not found' })
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create a setting' })
  @ApiResponse({ status: 201, description: 'Setting created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createDto: CreateSettingDto) {
    return this.settingsService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('bulk')
  @ApiOperation({ summary: 'Bulk upsert settings' })
  @ApiResponse({ status: 201, description: 'Settings upserted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  upsertMany(@Body() dto: BulkUpsertSettingDto) {
    return this.settingsService.upsertMany(dto.entries);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Update a setting' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Setting updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateDto: UpdateSettingDto) {
    return this.settingsService.update(+id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a setting' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Setting deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.settingsService.remove(+id);
  }
}
