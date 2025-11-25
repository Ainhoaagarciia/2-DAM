import { IsInt } from 'class-validator';

export class CreateVideoCategoriaDto {
  @IsInt()
  video_id: number;

  @IsInt()
  categoria_id: number;
}