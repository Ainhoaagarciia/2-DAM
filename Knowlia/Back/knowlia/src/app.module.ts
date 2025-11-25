import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsuarioModule } from './usuario/usuario.module';
import { VideoModule } from './video/video.module';
import { CategoriaModule } from './categoria/categoria.module';
import { VideoCategoriaModule } from './video_categoria/video_categoria.module';
import { FavoritoModule } from './favorito/favorito.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [DatabaseModule, UsuarioModule, VideoModule, CategoriaModule, VideoCategoriaModule, FavoritoModule, UploadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
