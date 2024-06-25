import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CloundinaryUploadFilesController } from './cloundinary.controller';
import { FileUploadEntity } from '../entities/file-upload.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CloundinaryUploadFilesController],
  imports: [ConfigModule, TypeOrmModule.forFeature([FileUploadEntity])], // Add ConfigModule here
  providers: [
    CloudinaryService,
    {
      provide: CloudinaryProvider,
      useFactory: (configService: ConfigService) => {
        return new CloudinaryProvider(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
