import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Video } from '../../video/entities/video.entity';
import { Categoria } from '../../categoria/entities/categoria.entity';

@Entity({ name: 'video_categoria' })
export class VideoCategoria {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Video, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @ManyToOne(() => Categoria, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

}