import { Module } from '@nestjs/common';
import { SizesService } from './sizes.service';
import { SizesController } from './controller/sizes.controller';
import { AdminSizesController } from './controller/admin-sizes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeEntity } from './entities/size.entity';
import { LoggerModule } from '@/logger/logger.module';
import { ProductEntity } from '@/app/product/product.entity';

@Module({
  controllers: [SizesController, AdminSizesController],
  providers: [SizesService],
  imports: [
    TypeOrmModule.forFeature([SizeEntity, ProductEntity]),
    LoggerModule,
  ],
})
export class SizesModule {}
