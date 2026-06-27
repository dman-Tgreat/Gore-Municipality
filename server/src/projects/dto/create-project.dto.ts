import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @IsOptional()
  @IsString()
  fundingSource?: string;

  @IsOptional()
  @IsString()
  contractor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
