import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './entities/setting.entity';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
  ) {}

  async create(createDto: CreateSettingDto): Promise<Setting> {
    const setting = this.settingRepository.create(createDto);
    return this.settingRepository.save(setting);
  }

  async findAll(): Promise<Setting[]> {
    return this.settingRepository.find();
  }

  async findByKey(key: string): Promise<string | null> {
    const setting = await this.settingRepository.findOne({ where: { settingKey: key } });
    return setting ? setting.settingValue : null;
  }

  async findOne(id: number): Promise<Setting> {
    const setting = await this.settingRepository.findOne({ where: { id } });
    if (!setting) {
      throw new NotFoundException(`Setting with id ${id} not found`);
    }
    return setting;
  }

  async update(id: number, updateDto: UpdateSettingDto): Promise<Setting> {
    const setting = await this.findOne(id);
    Object.assign(setting, updateDto);
    return this.settingRepository.save(setting);
  }

  async remove(id: number): Promise<{ message: string }> {
    const setting = await this.findOne(id);
    await this.settingRepository.remove(setting);
    return { message: `Setting #${id} deleted successfully` };
  }

  // Bulk upsert: accepts an array of { key, value } and upserts each
  async upsertMany(entries: { settingKey: string; settingValue: string }[]): Promise<Setting[]> {
    const results: Setting[] = [];
    for (const entry of entries) {
      const existing = await this.settingRepository.findOne({ where: { settingKey: entry.settingKey } });
      if (existing) {
        existing.settingValue = entry.settingValue;
        results.push(await this.settingRepository.save(existing));
      } else {
        results.push(await this.settingRepository.save(this.settingRepository.create(entry)));
      }
    }
    return results;
  }
}
