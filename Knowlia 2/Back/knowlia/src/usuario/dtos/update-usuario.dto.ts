import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;
}