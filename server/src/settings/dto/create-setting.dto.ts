import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSettingDto {
  @IsNotEmpty()
  @IsString()
  settingKey!: string;

  @IsNotEmpty()
  @IsString()
  settingValue!: string;

  @IsOptional()
  @IsString()
  settingValueam!: string;

  @IsOptional()
  @IsString()
  settingValueom!: string;
}
