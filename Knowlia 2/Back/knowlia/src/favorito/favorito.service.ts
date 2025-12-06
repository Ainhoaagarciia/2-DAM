import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorito } from './entities/favorito.entity';
import { CreateFavoritoDto } from './dtos/create-favorito.dto';

@Injectable()
export class FavoritoService {
  constructor(
    @InjectRepository(Favorito)
    private readonly repo: Repository<Favorito>,
  ) {}

  async crear(dto: CreateFavoritoDto): Promise<Favorito> {
    // Evitar duplicados (opcional, suele controlarse también con restricción UNIQUE)
    const existe = await this.repo.findOne({
      where: { usuario: { id: dto.usuario_id }, video: { id: dto.video_id } }
    });
    if (existe) throw new Error('Este favorito ya existe');
    const favorito = this.repo.create({
      usuario: { id: dto.usuario_id },
      video: { id: dto.video_id }
    });
    return await this.repo.save(favorito);
  }

  async eliminar(usuario_id: number, video_id: number): Promise<void> {
    await this.repo.delete({ usuario: { id: usuario_id }, video: { id: video_id } });
  }

  async listarPorUsuario(usuario_id: number): Promise<Favorito[]> {
    return await this.repo.find({
    where: { usuario: { id: usuario_id } },
    relations: ['video', 'video.autor', 'video.videoCategorias', 'video.videoCategorias.categoria']
    });
  }
}