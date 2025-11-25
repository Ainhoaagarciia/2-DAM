import { Test, TestingModule } from '@nestjs/testing';
import { VideoCategoriaController } from './video_categoria.controller';

describe('VideoCategoriaController', () => {
  let controller: VideoCategoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoCategoriaController],
    }).compile();

    controller = module.get<VideoCategoriaController>(VideoCategoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
