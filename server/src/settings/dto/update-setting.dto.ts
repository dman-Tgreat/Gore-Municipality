import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { CreateSettingDto } from './create-setting.dto';

export class UpdateSettingDto extends PartialType(CreateSettingDto) {
  @ApiPropertyOptional({ example: 'Gore Woreda', description: 'Updated setting value' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  settingValue?: string;

  @ApiPropertyOptional({ example: 'ጎሬ ወረዳ' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  settingValueam?: string;

  @ApiPropertyOptional({ example: 'Gore Woreda' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  settingValueom?: string;
}
