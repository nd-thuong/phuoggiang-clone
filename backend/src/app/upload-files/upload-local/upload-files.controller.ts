import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { MulterConfigService } from './multer-config.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MaxSizeFile } from '@/utils/enum';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RemoveFileDto } from '../dto/upload-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUploadEntity } from '../entities/file-upload.entity';
import { Repository } from 'typeorm';

@ApiTags('uploads')
@Controller('upload-local')
export class UploadFilesController {
  constructor(
    private readonly multerService: MulterConfigService,
    @InjectRepository(FileUploadEntity)
    private readonly fileRepository: Repository<FileUploadEntity>,
  ) {}

  @ApiConsumes('multipart/form-data')
  @Post('/single')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MaxSizeFile } }),
  )
  async uploadFileSingle(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadEntity> {
    try {
      const fileCreate = this.fileRepository.create({
        originalname: file.originalname,
        mimetype: file.mimetype,
        filename: file.filename, // Cloudinary public ID
        path: file.path, // URL to access the file
        size: file.size,
      });
      await this.fileRepository.save(fileCreate);
      return fileCreate;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  @ApiConsumes('multipart/form-data')
  @Post('/multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, { limits: { fileSize: MaxSizeFile } }),
  )
  async uploadMultipleFile(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<FileUploadEntity[]> {
    try {
      const promises = files.map(async (file) => {
        const fileCreate = this.fileRepository.create({
          originalname: file.originalname,
          mimetype: file.mimetype,
          filename: file.filename, // Cloudinary public ID
          path: file.path, // URL to access the file
          size: file.size,
        });
        await this.fileRepository.save(fileCreate);
        return fileCreate;
      });
      return await Promise.all(promises);
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  @Delete()
  async deleteFile(@Body() { filenames }: RemoveFileDto): Promise<boolean> {
    try {
      const kq = await this.multerService.removeFile(filenames);
      if (kq) {
        for (const filename of filenames) {
          const file = await this.fileRepository.findOneBy({ filename });
          if (file) {
            await this.fileRepository.remove(file);
          }
        }
      }
      return kq;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
