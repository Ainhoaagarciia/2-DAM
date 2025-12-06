import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { UpdateUsuarioDto } from './dtos/update-usuario.dto';
import { LoginUsuarioDto } from './dtos/login-usuario.dto'; 
import { Usuario } from './entities/usuario.entity';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async crearUsuario(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
    return await this.usuarioService.crearUsuario(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginUsuarioDto) {
    return await this.usuarioService.validarLogin(dto);
  }

  @Get()
  findAll() {
      return this.usuarioService.findAll();
  }

  @Get(':id')
  async obtenerUsuario(@Param('id') id: string): Promise<Usuario | null> {
    return await this.usuarioService.buscarPorId(Number(id));
  }

  @Patch(':id')
  async actualizar(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return await this.usuarioService.actualizarUsuario(Number(id), dto);
  }
}