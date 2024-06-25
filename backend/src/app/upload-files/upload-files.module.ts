import { Module } from '@nestjs/common';
import { LoacalUploadFilesModule } from './upload-local/local-upload.module';
import { CloudinaryModule } from './upload-cloundinary/cloudinary.module';

@Module({
  imports: [LoacalUploadFilesModule, CloudinaryModule],
})
export class UploadFilesModule {}
