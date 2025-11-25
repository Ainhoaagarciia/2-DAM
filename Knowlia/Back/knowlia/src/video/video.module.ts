import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { Usuario } from '../usuario/entities/usuario.entity';
import { VideoCategoria } from 'src/video_categoria/entities/video_categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Video, Usuario, VideoCategoria])],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}