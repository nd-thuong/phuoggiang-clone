import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryProvider {
  constructor(private _configService: ConfigService) {
    cloudinary.config({
      cloud_name: _configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: _configService.get('CLOUDINARY_API_KEY'),
      api_secret: _configService.get('CLOUDINARY_API_SECRET'),
    });
  }
}
