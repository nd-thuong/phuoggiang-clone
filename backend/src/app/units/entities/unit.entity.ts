// import { toVietnamTimezone } from '@/helpers/request.helper';
import { ProductEntity } from '@/app/product/entities/product.entity';
import { BaseEntity } from '@/utils/Base.entity';
import {
  // BeforeInsert,
  // BeforeRemove,
  // BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm';
import { UnitConversionEntity } from '@/app/product/entities/unit-conversions.entity';
import { InventoryEntity } from '@/app/inventories/entities/inventory.entity';
import { InventoryEntryEntity } from '@/app/inventories/entities/inventory_entries.entity';

@Entity('units')
export class UnitEntity extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.baseUnit)
  products: ProductEntity[];

  @OneToMany(
    () => UnitConversionEntity,
    (unitConversion) => unitConversion.unit,
  )
  unitConversions: UnitConversionEntity[];

  @OneToMany(() => InventoryEntity, (inventory) => inventory.unit)
  inventories: InventoryEntity[];

  @OneToMany(
    () => InventoryEntryEntity,
    (inventoryEntry) => inventoryEntry.unitConversion,
  )
  unitConversion: InventoryEntryEntity[];

  @OneToMany(
    () => InventoryEntryEntity,
    (inventoryEntry) => inventoryEntry.unitInventory,
  )
  unitInventory: InventoryEntryEntity[];

  // @BeforeInsert()
  // setCreateDate() {
  //   this.createdAt = toVietnamTimezone(new Date());
  // }

  // @BeforeUpdate()
  // setUpdateDate() {
  //   this.updatedAt = toVietnamTimezone(new Date());
  // }

  // @BeforeRemove()
  // setDeleteDate() {
  //   this.deletedAt = toVietnamTimezone(new Date());
  // }
}
