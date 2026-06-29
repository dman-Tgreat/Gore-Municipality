import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNewsDto {
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

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsString()
  @IsNotEmpty()
  summary!: string;

  @IsOptional()
  @IsString()
  summaryAm?: string;

  @IsOptional()
  @IsString()
  summaryOm?: string;

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
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}