import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({ example: 'Gore Woreda Launches Digital Services Portal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({ example: 'ጎሬ ወረዳ የዲጂታል አገልግሎት ፖርታል አስጀመረ' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleAm?: string;

  @ApiPropertyOptional({ example: 'Gore Woreda Paartala Tajaajila Dijitaalaa Banatte' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleOm?: string;

  @ApiPropertyOptional({ example: 'gore-digital-portal-launch' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiProperty({ example: 'The Gore Woreda administration has launched its new digital services portal.' })
  @IsString()
  @IsNotEmpty()
  summary!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summaryAm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summaryOm?: string;

  @ApiProperty({ example: 'Full article content in English...' })
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

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/.../image.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
