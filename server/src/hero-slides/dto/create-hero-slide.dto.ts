import { IsNotEmpty, IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateHeroSlideDto {
  @IsNotEmpty()
  @IsString()
  imageUrl!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
