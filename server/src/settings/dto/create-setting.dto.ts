import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSettingDto {
  @ApiProperty({ example: 'site_name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  settingKey!: string;

  @ApiProperty({ example: 'Gore Woreda' })
  @IsString()
  @MaxLength(2000)
  settingValue!: string;

  @ApiPropertyOptional({ example: 'ጎሬ ወረዳ' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  settingValueam!: string;

  @ApiPropertyOptional({ example: 'Gore Woreda' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  settingValueom!: string;
}
