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
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('key/:key')
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDto: CreateSettingDto) {
    return this.settingsService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('bulk')
  upsertMany(@Body() entries: { settingKey: string; settingValue: string }[]) {
    return this.settingsService.upsertMany(entries);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateSettingDto) {
    return this.settingsService.update(+id, updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingsService.remove(+id);
  }
}
