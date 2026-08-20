import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateHeroSlideDto {
  @ApiProperty({ example: 'https://res.cloudinary.com/.../slide1.jpg' })
  @IsNotEmpty()
  @IsString()
  imageUrl!: string;

  @ApiProperty({ example: 'Welcome to Gore Woreda' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
