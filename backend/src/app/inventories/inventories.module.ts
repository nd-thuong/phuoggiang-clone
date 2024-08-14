import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from './entities/inventory.entity';
import { ProductEntity } from '../product/entities/product.entity';
import { InventoryEntryEntity } from './entities/inventory_entries.entity';

@Module({
  controllers: [InventoriesController],
  providers: [InventoriesService],
  imports: [
    TypeOrmModule.forFeature([
      InventoryEntity,
      ProductEntity,
      InventoryEntryEntity,
    ]),
  ],
  exports: [InventoriesService],
})
export class InventoriesModule {}
