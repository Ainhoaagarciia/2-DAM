import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VideoCategoria } from '../../video_categoria/entities/video_categoria.entity';

@Entity({ name: 'categoria' })
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  nombre: string;
  @OneToMany(() => VideoCategoria, vc => vc.categoria)
  videoCategorias: VideoCategoria[];
}
