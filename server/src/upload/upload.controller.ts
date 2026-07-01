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
import { memoryStorage } from 'multer';
import { extname, join, basename } from 'path';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
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
      storage: memoryStorage(), // Use memoryStorage so file.buffer is available for validation
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
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    const filePath = join(UPLOADS_DIR, filename);

    // Write the buffer to disk manually
    try {
      writeFileSync(filePath, file.buffer);
    } catch (error) {
      throw new BadRequestException(`Failed to save file: ${error.message}`);
    }

    const url = `/uploads/${filename}`;
    return {
      success: true,
      url,
      filename,
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
