import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Delete,
  Body,
  Patch,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MaxSizeFile } from '@/utils/enum';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';
import { FileUploadEntity } from '../entities/file-upload.entity';
import { RemoveFileDto } from '../dto/upload-file.dto';

@ApiTags('uploads')
@Controller('cloudinary-upload')
export class CloundinaryUploadFilesController {
  constructor(private readonly cloundinaryService: CloudinaryService) {}

  @ApiConsumes('multipart/form-data')
  @Post('/single')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MaxSizeFile,
      },
    }),
  )
  async uploadFileSingle(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadEntity> {
    try {
      const fileResult = await this.cloundinaryService.uploadFile(file);
      return fileResult;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  @ApiConsumes('multipart/form-data')
  @Post('/multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: MaxSizeFile,
      },
    }),
  )
  async uploadMultipleFile(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<FileUploadEntity[]> {
    try {
      const fileResult = await this.cloundinaryService.uploadFiles(files);
      return fileResult;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  @Patch()
  async deleteFile(@Body() { filename, id }: RemoveFileDto): Promise<boolean> {
    try {
      await this.cloundinaryService.removeFile(filename, id);
      return true;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
