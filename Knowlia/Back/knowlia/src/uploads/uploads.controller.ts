import { Body, Controller, Post } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { PresignDto } from './dtos/presign.dto'; 

@Controller('uploads')    //http://localhost:3000/docs
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presign')
  async getPresignedUrl(@Body() dto: PresignDto) {
    const url = await this.uploadsService.generatePresignedUrl(dto.thumbnailKey);
    return { url, thumbnailKey: dto.thumbnailKey };
  }
}