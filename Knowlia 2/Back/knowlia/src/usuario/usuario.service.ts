import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dtos/create-usuario.dto';
import { LoginUsuarioDto } from './dtos/login-usuario.dto'; 
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async crearUsuario(dto: CreateUsuarioDto): Promise<Usuario> {
    const hash = await bcrypt.hash(dto.contrasena, 10);
    const newUser = this.usuarioRepository.create({
      ...dto,
      contrasena: hash,
    });
    return this.usuarioRepository.save(newUser);
  }

  async findAll() {
    return this.usuarioRepository.find();
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async actualizarUsuario(id: number, dto: any): Promise<any> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    
    if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
    }
    
    this.usuarioRepository.merge(usuario, dto);
    return await this.usuarioRepository.save(usuario);
  }
  async validarLogin(dto: LoginUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { nombre: dto.nombre } });
    
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const isMatch = await bcrypt.compare(dto.contrasena, usuario.contrasena);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return usuario;
  }
}