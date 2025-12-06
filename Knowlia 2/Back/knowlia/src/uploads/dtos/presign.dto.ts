import { ApiProperty } from '@nestjs/swagger';

export class PresignDto {
  @ApiProperty({ description: 'Nombre del archivo para guardar en S3', example: 'mi-foto-perfil.jpg' })
  thumbnailKey: string;
}