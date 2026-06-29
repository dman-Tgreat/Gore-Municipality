import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleAm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleOm?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descriptionAm?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descriptionOm?: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsString()
  contentAm?: string;

  @IsOptional()
  @IsString()
  contentOm?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
