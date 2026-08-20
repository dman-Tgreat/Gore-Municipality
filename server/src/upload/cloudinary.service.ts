import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  /**
   * Upload a file buffer to Cloudinary.
   * @param buffer  Raw file buffer (from Multer memoryStorage)
   * @param folder  Destination folder inside the Cloudinary account (e.g. "gore-municipality")
   * @param resourceType  'image' | 'raw'  (raw covers PDF, DOC, XLS, etc.)
   */
  async uploadBuffer(
    buffer: Buffer,
    folder = 'gore-municipality',
    resourceType: 'image' | 'raw' | 'auto' = 'auto',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          // Automatically detect format; also converts to webp for images when beneficial
          fetch_format: 'auto',
          quality: 'auto',
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            reject(new BadRequestException(error?.message || 'Cloudinary upload failed'));
          } else {
            resolve(result);
          }
        },
      );
      uploadStream.end(buffer);
    });
  }

  /**
   * Delete a file from Cloudinary by its public_id.
   * @param publicId  The Cloudinary public_id (returned as `result.public_id` on upload)
   */
  async deleteByPublicId(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  }

  /**
   * Extract the public_id from a Cloudinary URL so we can delete it later.
   * Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/<resource_type>/upload/<transformations>/<public_id>.<ext>
   */
  extractPublicId(url: string): string | null {
    try {
      const urlObj = new URL(url);
      // pathname looks like: /<cloud_name>/image/upload/v1234567/gore-municipality/filename
      // We want everything after /upload/ (without version prefix v\d+/) and without the extension
      const parts = urlObj.pathname.split('/upload/');
      if (parts.length < 2) return null;
      let publicIdWithExt = parts[1];
      // Remove optional version segment v<digits>/
      publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, '');
      // Remove file extension
      const lastDot = publicIdWithExt.lastIndexOf('.');
      return lastDot !== -1 ? publicIdWithExt.substring(0, lastDot) : publicIdWithExt;
    } catch {
      return null;
    }
  }
}
