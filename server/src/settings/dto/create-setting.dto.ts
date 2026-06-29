import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSettingDto {
  @IsNotEmpty()
  @IsString()
  settingKey!: string;

  @IsNotEmpty()
  @IsString()
  settingValue!: string;
}
