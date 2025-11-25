import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateUsuarioDto } from '../usuario/dtos/create-usuario.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
    constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async crearUsuario(dto: CreateUsuarioDto): Promise<Usuario> {
    // Hasheamos la contraseña antes de guardar
    const hash = await bcrypt.hash(dto.contrasena, 10);
    const newUser = this.usuarioRepository.create({
      ...dto,
      contrasena: hash,
    });
    return this.usuarioRepository.save(newUser);
  }

  findAll() {
    return this.usuarioRepository.find();
}

   async buscarPorId(id: number): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({ where: { correo } });
  }
}
