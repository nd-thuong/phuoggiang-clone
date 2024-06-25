import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadFilesController } from './upload-files.controller';
import { MulterConfigService } from './multer-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadEntity } from '../entities/file-upload.entity';

@Module({
  controllers: [UploadFilesController],
  providers: [MulterConfigService],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    TypeOrmModule.forFeature([FileUploadEntity]),
  ],
})
export class LoacalUploadFilesModule {}
