import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoCategoria } from './entities/video_categoria.entity';
import { VideoCategoriaController } from './video_categoria.controller';
import { VideoCategoriaService } from './video_categoria.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoCategoria])],
  controllers: [VideoCategoriaController],
  providers: [VideoCategoriaService],
})
export class VideoCategoriaModule {}