import { Module } from '@nestjs/common';
import { LocalUploadFilesModule } from './upload-local/local-upload.module';
import { CloudinaryModule } from './upload-cloundinary/cloudinary.module';

@Module({
  imports: [LocalUploadFilesModule, CloudinaryModule],
})
export class UploadFilesModule {}
