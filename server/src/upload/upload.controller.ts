import {
  Controller,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    }),
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp|pdf|doc|docx|xls|xlsx)$/ }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    // Determine resource type for Cloudinary
    const isImage = file.mimetype.startsWith('image/');
    const resourceType: 'image' | 'raw' | 'auto' = isImage ? 'image' : 'raw';

    const result = await this.cloudinaryService.uploadBuffer(
      file.buffer,
      'gore-municipality',
      resourceType,
    );

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      width: result.width,
      height: result.height,
    };
  }

  /**
   * Delete a file from Cloudinary.
   * Accepts a `publicId` query param (preferred) or falls back to extracting it from a URL.
   */
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteFile(
    @Query('publicId') publicId?: string,
    @Query('url') url?: string,
  ) {
    let id = publicId;

    if (!id && url) {
      id = this.cloudinaryService.extractPublicId(url) ?? undefined;
    }

    if (!id) {
      throw new BadRequestException('Provide either a `publicId` or `url` query parameter');
    }

    await this.cloudinaryService.deleteByPublicId(id);
    return { success: true, message: `File "${id}" deleted from Cloudinary` };
  }
}
