import { Module } from '@nestjs/common';
import { AdminProductTypeController } from './admin-product-type.controller';
import { ProductTypeService } from './product-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from './product-type.entity';
import { ProductTypeController } from './product-type.controller';
import { LoggerModule } from '@/logger/logger.module';
import { ProductEntity } from '@/app/product/product.entity';

@Module({
  controllers: [AdminProductTypeController, ProductTypeController],
  providers: [ProductTypeService],
  imports: [
    TypeOrmModule.forFeature([ProductTypeEntity, ProductEntity]),
    LoggerModule,
  ],
})
export class ProductTypeModule {}
