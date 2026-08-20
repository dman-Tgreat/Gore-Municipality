import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Public Notice: Municipal Office Hours Update' })
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

  @ApiProperty({ example: 'Updated office hours for all municipal departments.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descriptionAm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  descriptionOm?: string;

  @ApiProperty({ example: 'Full announcement content...' })
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

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
