import {
  Controller,
  Post,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileValidator,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';

/**
 * Whitelist of allowed MIME types (matches jpg, jpeg, png, gif, webp,
 * pdf, doc, docx, xls, xlsx). Unlike FileTypeValidator with a filename
 * regex, this correctly handles Office document mimetypes such as
 * `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
 */
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

class MimeTypeWhitelistValidator extends FileValidator<{ allowedMimeTypes: string[] }> {
  isValid(file?: any): boolean {
    return !!file && this.validationOptions.allowedMimeTypes.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return `File type not allowed. Allowed types: ${this.validationOptions.allowedMimeTypes.join(', ')}`;
  }
}

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    }),
  )
  @ApiOperation({ summary: 'Upload a file to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (jpg, jpeg, png, gif, webp, pdf, doc, docx, xls, xlsx). Max 10MB.',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully, returns Cloudinary URL' })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new MimeTypeWhitelistValidator({ allowedMimeTypes: ALLOWED_MIME_TYPES }),
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
  @ApiBearerAuth()
  @Delete()
  @ApiOperation({ summary: 'Delete a file from Cloudinary' })
  @ApiQuery({ name: 'publicId', required: false, type: String, description: 'Cloudinary public ID' })
  @ApiQuery({ name: 'url', required: false, type: String, description: 'Cloudinary URL (publicId will be extracted)' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  @ApiResponse({ status: 400, description: 'Provide either publicId or url query parameter' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
