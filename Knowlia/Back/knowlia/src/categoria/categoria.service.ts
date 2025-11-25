import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async crearCategoria(dto: CreateCategoriaDto): Promise<Categoria> {
    const existe = await this.categoriaRepository.findOne({ where: { nombre: dto.nombre } });
    if (existe) {
      throw new Error('Ya existe una categoría con ese nombre');
    }
    const categoria = this.categoriaRepository.create(dto);
    return await this.categoriaRepository.save(categoria);
  }

  async listar(): Promise<Categoria[]> {
    return await this.categoriaRepository.find();
  }

  async buscarPorId(id: number): Promise<Categoria | null> {
    return await this.categoriaRepository.findOne({ where: { id } });
  }
}