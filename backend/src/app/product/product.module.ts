import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { AdminProductController } from './admin-product.controller';

@Module({
  controllers: [ProductController, AdminProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([ProductEntity])],
})
export class ProductModule {}
