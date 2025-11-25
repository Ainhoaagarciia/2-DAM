import { Test, TestingModule } from '@nestjs/testing';
import { VideoCategoriaService } from './video_categoria.service';

describe('VideoCategoriaService', () => {
  let service: VideoCategoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoCategoriaService],
    }).compile();

    service = module.get<VideoCategoriaService>(VideoCategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
