import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Rural Roads Upgrade Project' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nameAm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nameOm?: string;

  @ApiProperty({ example: 'A major infrastructure project to upgrade rural roads.' })
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

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiPropertyOptional({ example: 'planned', enum: ['planned', 'ongoing', 'completed'], default: 'planned' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Gore Town' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @ApiPropertyOptional({ example: 'Federal Government' })
  @IsOptional()
  @IsString()
  fundingSource?: string;

  @ApiPropertyOptional({ example: 'ABC Construction' })
  @IsOptional()
  @IsString()
  contractor?: string;

  @ApiPropertyOptional({ example: 'infrastructure' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
