import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dtos/create-categoria.dto';

@Controller('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  async crear(@Body() dto: CreateCategoriaDto) {
    return await this.categoriaService.crearCategoria(dto);
  }

  @Get()
  async listar() {
    return await this.categoriaService.listar();
  }

  @Get(':id')
  async buscarPorId(@Param('id') id: string) {
    return await this.categoriaService.buscarPorId(Number(id));
  }
}