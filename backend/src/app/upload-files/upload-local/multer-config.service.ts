import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  // private readonly _appConfig: AppConfig;

  constructor(private _configService: ConfigService) {}

  public createMulterOptions(): MulterOptions | Promise<MulterOptions> {
    const storagesLocal = () =>
      diskStorage({
        destination: (req, file, cb) => {
          // const { user } = req as RequestWithUser<AuthenticationEntity>;
          // let directory = this._appConfig.uploadDirectory;
          let directory = './uploads';
          // const isBasedUser = String(req.query.user || '').trim() === 'on';
          // if (isBasedUser && user?.email) {
          //   directory += `/${user.email}`;
          // }
          const subDir = String(req.query.folder || '').trim();
          if (subDir) {
            directory += `/${subDir}`;
          }
          // join(process.cwd(), directory);
          if (!existsSync(directory)) {
            mkdirSync(directory, { recursive: true });
          }

          cb(null, path.normalize(directory));
        },
        filename: (request, file, callback) => {
          if (!file || !file.originalname) {
            return callback(
              new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  errors: {
                    file: 'File must have an original name',
                  },
                },
                HttpStatus.BAD_REQUEST,
              ),
              'error',
            );
          }
          const extname = path.extname(file.originalname);
          const filenameWithoutExt = file.originalname.replace(extname, '');
          callback(
            null,
            `${filenameWithoutExt}-${randomStringGenerator()}${extname}`,
          );
        },
      });

    return {
      fileFilter: (request, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return callback(
            new HttpException(
              {
                status: HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                  file: `File must be an image`,
                },
              },
              HttpStatus.UNPROCESSABLE_ENTITY,
            ),
            false,
          );
        }

        callback(null, true);
      },
      // storage: memoryStorage(),
      storage: storagesLocal(),
      limits: {
        // files: this._appConfig.uploadMaxCount,
        files: 10,
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    };
  }

  public async removeFile(filenames: string[]): Promise<boolean> {
    const filesNotFound = [];
    // Kiểm tra sự tồn tại của tất cả các file
    for (const fileName of filenames) {
      const filePath = path.join(__dirname, '../../../uploads', fileName);
      // Nếu file không tồn tại, thêm vào danh sách filesNotFound
      if (!fs.existsSync(filePath)) {
        filesNotFound.push(fileName);
      }
    }

    if (filesNotFound.length > 0) {
      // Nếu có file không tồn tại, trả về lỗi và danh sách các file không tìm thấy
      throw new BadRequestException(
        `Các file này không tồn tại: ${filesNotFound.join(', ')}`,
      );
    }

    try {
      // Tất cả các file đều tồn tại, tiến hành xóa
      const deletionPromises = filenames.map((fileName) => {
        const filePath = path.join(__dirname, '../../../uploads', fileName);
        return fs.promises.unlink(filePath);
      });

      // Chờ xóa hết tất cả các file
      await Promise.all(deletionPromises);
      return true;
    } catch (error) {
      throw new HttpException('Lỗi xóa file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
