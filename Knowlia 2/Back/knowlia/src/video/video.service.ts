import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dtos/create-video.dto';
import { Usuario } from '../usuario/entities/usuario.entity';
import { VideoCategoria } from '../video_categoria/entities/video_categoria.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(VideoCategoria)
    private readonly videoCategoriaRepository: Repository<VideoCategoria>
  ) {}

  async crearVideo(dto: CreateVideoDto): Promise<Video> {
    // Solo profesores pueden publicar
    const autor = await this.usuarioRepository.findOne({ where: { id: dto.autor_id } });
    if (!autor || autor.rol !== 'profesor') {
      throw new ForbiddenException('Solo profesores pueden subir vídeos');
    }
    const { categoria_id, ...videoData } = dto;
    const video = this.videoRepository.create({
      ...videoData,
      autor,
    });
    
    const videoGuardado = await this.videoRepository.save(video);

    if (categoria_id) {
      const videoCategoria = this.videoCategoriaRepository.create({
        video: videoGuardado,
        categoria: { id: categoria_id }
      });
      await this.videoCategoriaRepository.save(videoCategoria);
    }

    return videoGuardado;
  }

  async buscarPorId(id: number): Promise<Video | null> {
    return await this.videoRepository.findOne({ where: { id }, relations: ['autor', 'videoCategorias', 'videoCategorias.categoria'] });
  }

  async buscarVideos(params: any) {
    const { q, category, categoria, autor_id, page = 1, limit = 10, sort = 'id', order = 'ASC' } = params;
    const categoryParam = category || categoria;
    const query = this.videoRepository.createQueryBuilder('video');

    query.leftJoinAndSelect('video.autor', 'autor');
    query.leftJoinAndSelect('video.videoCategorias', 'videoCategoria');
    query.leftJoinAndSelect('videoCategoria.categoria', 'categoria');

    if (q) {
      query.andWhere('LOWER(video.titulo) LIKE LOWER(:q)', { q: `%${q}%` });
    }
    if (categoryParam) {
      query.innerJoin('video_categoria', 'vc', 'vc.video_id = video.id')
        .andWhere('vc.categoria_id = :categoryId', { categoryId: Number(categoryParam) });
    }
    if (autor_id) {
      query.andWhere('video.autor_id = :autorId', { autorId: Number(autor_id) });
    }
    query.orderBy(`video.${sort}`, order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
    query.skip((page - 1) * limit).take(limit);

    const [videos, total] = await query.getManyAndCount();
    return { total, videos };
  }

  async actualizarVideo(id: number, dto: any): Promise<Video> {

    const video = await this.videoRepository.findOne({ 
      where: { id }, 
      relations: ['autor'] 
    });

    if (!video) {
      throw new NotFoundException('Video no encontrado');
    }

    this.videoRepository.merge(video, dto);
    
    return await this.videoRepository.save(video);
  }
  async eliminarVideo(id: number): Promise<void> {
    const video = await this.videoRepository.findOne({ where: { id } });
    if (!video) {
      throw new NotFoundException('Video no encontrado');
    }
    await this.videoRepository.delete(id);
  }
}