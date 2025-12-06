import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateVideoDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  precio?: number;
  
  @IsNumber()
  @IsOptional()
  autor_id?: number; 
}