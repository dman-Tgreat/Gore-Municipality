import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateInvestmentDto {
  @ApiProperty({ example: 'Coffee Farm Investment Opportunity' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleAm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleOm?: string;

  @ApiProperty({ example: 'Investment opportunity in premium coffee production.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionAm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descriptionOm?: string;

  @ApiProperty({ example: 'Full investment details...' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contentAm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contentOm?: string;

  @ApiProperty({ example: 'agriculture', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ example: 'Gore Woreda, Illubabor Zone' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: '+251 47 111 2200' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'invest@gore.gov.et' })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
