import { Controller, Post, Delete, Get, Param, Query } from '@nestjs/common';
import { FavoritoService } from './favorito.service';

@Controller()
export class FavoritoController {
  constructor(private readonly favoritoService: FavoritoService) {}

  // Añadir favorito
  @Post('favorito/:video_id')
  async crearFavorito(
    @Param('video_id') video_id: string,
    @Query('usuario_id') usuario_id: string,
  ) {
    return await this.favoritoService.crear({
      usuario_id: Number(usuario_id),
      video_id: Number(video_id),
    });
  }

  // Eliminar favorito
  @Delete('favorito/:video_id')
  async borrarFavorito(
    @Param('video_id') video_id: string,
    @Query('usuario_id') usuario_id: string,
  ) {
    return await this.favoritoService.eliminar(Number(usuario_id), Number(video_id));
  }

  // Listar favoritos de un usuario
  @Get('favorito')
  async listarPorUsuario(@Query('usuario_id') usuario_id: string) {
    return await this.favoritoService.listarPorUsuario(Number(usuario_id));
  }
}