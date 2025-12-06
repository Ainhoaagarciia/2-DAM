import { IsEmail, IsNotEmpty, MinLength, IsIn, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()  
  @IsEmail()
  correo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  contrasena: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['profesor', 'estudiante'])
  rol: string;
  
  @IsString()
  @IsNotEmpty()
  avatar_url?: string;
}