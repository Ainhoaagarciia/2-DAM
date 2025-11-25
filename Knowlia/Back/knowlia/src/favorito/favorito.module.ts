import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito } from './entities/favorito.entity';
import { FavoritoController } from './favorito.controller';
import { FavoritoService } from './favorito.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorito])],
  controllers: [FavoritoController],
  providers: [FavoritoService],
})
export class FavoritoModule {}