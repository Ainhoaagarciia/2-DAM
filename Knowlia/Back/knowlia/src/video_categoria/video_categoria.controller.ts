import { Controller, Post, Get, Body } from '@nestjs/common';
import { VideoCategoriaService } from './video_categoria.service';
import { CreateVideoCategoriaDto } from './dtos/create-video_categoria.dto';

@Controller('video_categoria')
export class VideoCategoriaController {
  constructor(private readonly service: VideoCategoriaService) {}

  @Post()
  async crear(@Body() dto: CreateVideoCategoriaDto) {
    return await this.service.crearAsociacion(dto);
  }

  @Get()
  async listar() {
    return await this.service.listar();
  }
}