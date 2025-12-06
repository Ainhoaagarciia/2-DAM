import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoCategoria } from './entities/video_categoria.entity';
import { CreateVideoCategoriaDto } from './dtos/create-video_categoria.dto';

@Injectable()
export class VideoCategoriaService {
  constructor(
    @InjectRepository(VideoCategoria)
    private readonly repo: Repository<VideoCategoria>,
  ) {}

  async crearAsociacion(dto: CreateVideoCategoriaDto): Promise<VideoCategoria> {
    const entity = this.repo.create({
      video: { id: dto.video_id },
      categoria: { id: dto.categoria_id },
    });
    return await this.repo.save(entity);
  }

  async listar(): Promise<VideoCategoria[]> {
    return await this.repo.find({ relations: ['video', 'categoria'] });
  }
}