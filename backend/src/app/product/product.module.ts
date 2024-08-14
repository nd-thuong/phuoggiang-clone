import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { AdminProductController } from './controller/admin-product.controller';
import { UnitConversionEntity } from './entities/unit-conversions.entity';
import { InventoriesModule } from '../inventories/inventories.module';
import { LocalUploadFilesModule } from '../upload-files/upload-local/local-upload.module';
import { CloudinaryModule } from '../upload-files/upload-cloundinary/cloudinary.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ProductController, AdminProductController],
  providers: [ProductService],
  imports: [
    TypeOrmModule.forFeature([ProductEntity, UnitConversionEntity]),
    InventoriesModule,
    HttpModule,
  ],
})
export class ProductModule {}
