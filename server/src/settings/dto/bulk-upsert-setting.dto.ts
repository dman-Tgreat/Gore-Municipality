import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class SettingEntryDto {
  @ApiProperty({ example: 'site_name', description: 'Unique setting key' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  settingKey!: string;

  @ApiProperty({ example: 'Gore Woreda', description: 'Setting value' })
  @IsString()
  @MaxLength(2000)
  settingValue!: string;
}

export class BulkUpsertSettingDto {
  @ApiProperty({ type: [SettingEntryDto], description: 'Array of settings to upsert' })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SettingEntryDto)
  entries!: SettingEntryDto[];
}
