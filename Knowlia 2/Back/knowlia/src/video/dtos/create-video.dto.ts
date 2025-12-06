import { IsNotEmpty, IsNumber, Min, IsInt, IsString, MinLength } from 'class-validator';
import { IsYouTubeUrl } from './validators/is-youtube-url.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ minLength: 3 })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres.' })
  titulo: string;

  @IsString()
  descripcion?: string;

  @IsNumber()
  @Min(0, { message: 'El precio debe ser mayor o igual a 0.' })
  precio: number;

  @IsNotEmpty()
  @IsYouTubeUrl({ message: 'La URL debe ser de YouTube.' })
  url_video: string;

  @IsNotEmpty({ message: 'La clave del thumbnail es obligatoria.' })
  clave_thumbnail: string;

  @IsInt()
  autor_id: number; 

  @IsInt({ message: 'Debes seleccionar una categoría válida.' })
  categoria_id: number;
}