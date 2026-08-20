import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

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

  @ApiProperty({ example: '+251 47 111 2233' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[+]?[\d\s\-()]+$/, {
    message: 'phone must contain only digits, spaces, dashes, parentheses, and optional leading +',
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
  @MaxLength(500)
  image?: string;
}
