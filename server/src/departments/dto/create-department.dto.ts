import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  nameAm?: string;

  @IsOptional()
  @IsString()
  nameOm?: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  descriptionAm?: string;

  @IsOptional()
  @IsString()
  descriptionOm?: string;

  @IsString()
  @IsNotEmpty()
  head!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[+]?[\d\s\-()]+$/, {
    message: 'phone must contain only digits, spaces, dashes, parentheses, and optional leading +',
  })
  phone!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  office!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;
}
