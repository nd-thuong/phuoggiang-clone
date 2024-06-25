import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import * as streamifier from 'streamifier';
import { Repository } from 'typeorm';
import { FileUploadEntity } from '../entities/file-upload.entity';
import { InjectRepository } from '@nestjs/typeorm';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

@Injectable()
export class CloudinaryService {
  constructor(
    @InjectRepository(FileUploadEntity)
    private readonly fileRepository: Repository<FileUploadEntity>,
  ) {}
  async uploadFile(file: Express.Multer.File): Promise<FileUploadEntity> {
    return new Promise<FileUploadEntity>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        async (error, result) => {
          if (error) return reject(error);
          const fileCreate = this.fileRepository.create({
            originalname: file.originalname,
            mimetype: file.mimetype,
            filename: result.public_id, // Cloudinary public ID
            path: result.secure_url, // URL to access the file
            size: result.bytes,
          });
          await this.fileRepository.save(fileCreate);
          resolve(fileCreate);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<FileUploadEntity[]> {
    const promises = files.map((file) => {
      return this.uploadFile(file);
    });
    return await Promise.all(promises);
  }

  async removeFile(publicId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, async (error, result) => {
        if (error) return reject(error);
        if (result?.result === 'not found')
          return reject({ message: `Không tìm thấy file: ${publicId}` });
        const fileRsult = await this.fileRepository.findOneBy({
          filename: publicId,
        });
        if (fileRsult.id) {
          await this.fileRepository.remove(fileRsult);
        }
        resolve(true);
      });
    });
  }

  async removeFiles(filenames: string[]): Promise<boolean[]> {
    const promises = filenames.map((filename) => {
      return this.removeFile(filename);
    });
    return await Promise.all(promises);
  }
}
