import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({ example: 'site_name' })
  @IsNotEmpty()
  @IsString()
  settingKey!: string;

  @ApiProperty({ example: 'Gore Woreda' })
  @IsNotEmpty()
  @IsString()
  settingValue!: string;

  @ApiPropertyOptional({ example: 'ጎሬ ወረዳ' })
  @IsOptional()
  @IsString()
  settingValueam!: string;

  @ApiPropertyOptional({ example: 'Gore Woreda' })
  @IsOptional()
  @IsString()
  settingValueom!: string;
}
