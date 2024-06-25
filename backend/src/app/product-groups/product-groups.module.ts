import { Module } from '@nestjs/common';
import { ProductGroupsService } from './product-groups.service';
import { ProductGroupsController } from './controller/product-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@/logger/logger.module';
import { ProductGroupEntity } from './entities/product-group.entity';
import { AdminProductGroupsController } from './controller/admin-product-groups.controller';
import { BrandEntity } from '@/app/brands/entities/brand.entity';

@Module({
  controllers: [ProductGroupsController, AdminProductGroupsController],
  providers: [ProductGroupsService],
  imports: [
    TypeOrmModule.forFeature([ProductGroupEntity, BrandEntity]),
    LoggerModule,
  ],
})
export class ProductGroupsModule {}
