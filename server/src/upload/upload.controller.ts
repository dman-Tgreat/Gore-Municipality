import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, basename } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const UPLOADS_DIR = join(__dirname, '..', '..', 'uploads');

// Ensure uploads directory exists
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

@Controller('upload')
export class UploadController {
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOADS_DIR,
        filename: (_req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    }),
  )
  uploadFile(
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
    const url = `/uploads/${file.filename}`;
    return {
      success: true,
      url,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':filename')
  deleteFile(@Param('filename') filename: string) {
    const safeFilename = basename(filename);
    const filePath = join(UPLOADS_DIR, safeFilename);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`File "${filename}" not found`);
    }

    try {
      unlinkSync(filePath);
      return {
        success: true,
        message: `File "${filename}" deleted successfully`,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file "${filename}": ${error.message}`);
    }
  }
}
