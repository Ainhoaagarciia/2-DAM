import { IsInt } from 'class-validator';

export class CreateFavoritoDto {
  @IsInt()
  usuario_id: number;

  @IsInt()
  video_id: number;
}