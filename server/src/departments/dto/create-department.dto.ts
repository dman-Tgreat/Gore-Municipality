import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';
import { ETHIOPIAN_PHONE_REGEX, ETHIOPIAN_PHONE_MESSAGE } from '../../common/constants/ethiopian-phone';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Agriculture & Rural Development' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'ግብርና እና ገጠር ልማት' })
  @IsOptional()
  @IsString()
  nameAm?: string;

  @ApiPropertyOptional({ example: 'Qonnaa fi Misoma Baadiyyaa' })
  @IsOptional()
  @IsString()
  nameOm?: string;

  @ApiProperty({ example: 'Responsible for agricultural extension services.' })
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

  @ApiProperty({ example: 'Ato Tesfaye Alemu' })
  @IsString()
  @IsNotEmpty()
  head!: string;

  @ApiProperty({ example: '+251911234567', description: 'Ethiopian phone number' })
  @IsString()
  @IsNotEmpty()
  @Matches(ETHIOPIAN_PHONE_REGEX, {
    message: ETHIOPIAN_PHONE_MESSAGE,
  })
  phone!: string;

  @ApiProperty({ example: 'agriculture@gore.gov.et' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Block A, Room 201, Municipal Building' })
  @IsString()
  @IsNotEmpty()
  office!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'image must be a valid URL' })
  @MaxLength(500)
  image?: string;
}
