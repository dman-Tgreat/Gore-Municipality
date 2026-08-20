import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Matches,
} from 'class-validator';
import { ETHIOPIAN_PHONE_REGEX, ETHIOPIAN_PHONE_MESSAGE } from '../../common/constants/ethiopian-phone';

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
  @IsUrl({}, { message: 'coverImage must be a valid URL' })
  coverImage?: string;

  @ApiPropertyOptional({ example: 'Gore Woreda, Illubabor Zone' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: '+251911234567', description: 'Ethiopian phone number' })
  @IsOptional()
  @IsString()
  @Matches(ETHIOPIAN_PHONE_REGEX, {
    message: ETHIOPIAN_PHONE_MESSAGE,
  })
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'invest@gore.gov.et' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
