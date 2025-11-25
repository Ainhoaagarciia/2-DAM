import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async crearUsuario(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return await this.usuarioService.crearUsuario(dto);
  }

  @Get()
    findAll() {
        return this.usuarioService.findAll();
    }


  @Get(':id')
  async obtenerUsuario(@Param('id') id: string): Promise<Usuario | null> {
    return await this.usuarioService.buscarPorId(Number(id));
  }
}