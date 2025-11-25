import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dtos/create-video.dto';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  async crearVideo(@Body() dto: CreateVideoDto) {
    return await this.videoService.crearVideo(dto);
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return await this.videoService.buscarPorId(Number(id));
  }

  @Get()
  async listar(@Query() params) {
    return await this.videoService.buscarVideos(params);
  }
}