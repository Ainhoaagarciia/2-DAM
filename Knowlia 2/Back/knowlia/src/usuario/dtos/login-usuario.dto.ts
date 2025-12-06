import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUsuarioDto {
  @IsEmail()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  contrasena: string;
}