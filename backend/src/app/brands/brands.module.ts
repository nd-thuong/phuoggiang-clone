import { Module } from '@nestjs/common';
import { BrandService } from './brands.service';
import { BrandsController } from './controller/brands.controller';
import { AdminBrandController } from './controller/admin-brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandEntity } from './entities/brand.entity';
import { LoggerModule } from '@/logger/logger.module';
import { ProductEntity } from '@/app/product/product.entity';
import { SizeEntity } from '@/app/sizes/entities/size.entity';

@Module({
  controllers: [BrandsController, AdminBrandController],
  providers: [BrandService],
  imports: [
    TypeOrmModule.forFeature([BrandEntity, ProductEntity, SizeEntity]),
    LoggerModule,
  ],
})
export class BrandsModule {}
