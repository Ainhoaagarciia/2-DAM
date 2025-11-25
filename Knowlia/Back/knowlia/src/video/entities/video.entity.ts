import { Entity, Column, PrimaryGeneratedColumn, OneToMany,ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { VideoCategoria } from '../../video_categoria/entities/video_categoria.entity';

@Entity({ name: 'video' })
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('numeric')
  precio: number;

  @Column()
  url_video: string;

  @Column()
  clave_thumbnail: string;

  @Column('float', { nullable: true })
  valoracion: number;

  @Column('int', { nullable: true })
  numero_valoraciones: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'autor_id' })
  autor: Usuario;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creado_en: Date;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  actualizado_en: Date;

  
  @OneToMany(() => VideoCategoria, vc => vc.video)
  videoCategorias: VideoCategoria[];
}