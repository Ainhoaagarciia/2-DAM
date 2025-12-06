import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  contrasena: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ type: 'enum', enum: ['profesor', 'estudiante'] })
  rol: string;
  
}