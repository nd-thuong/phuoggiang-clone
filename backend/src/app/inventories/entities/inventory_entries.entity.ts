import { ProductEntity } from '@/app/product/entities/product.entity';
import { UnitEntity } from '@/app/units/entities/unit.entity';
import { BaseEntity } from '@/utils/Base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('inventory_entries')
export class InventoryEntryEntity extends BaseEntity {
  @Column()
  productId: string;
  @ManyToOne(() => ProductEntity, (product) => product.inventories)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column()
  unitInventoryId: string;
  @ManyToOne(() => UnitEntity, { eager: true }) // đơn vị nhập kho
  @JoinColumn({ name: 'unitInventoryId' })
  unitInventory: UnitEntity;

  @Column()
  unitConversionId: string;
  @ManyToOne(() => UnitEntity, { eager: true }) // đơn vị quy đổi
  @JoinColumn({ name: 'unitConversionId' })
  unitConversion: UnitEntity;

  @Column({ default: 0 }) // số lượng hàng tồn
  quantity: number;

  @Column({ default: 0 }) // số lượng hàng tồn khi quy đổi theo đơn vị chuẩn
  conversionQuantity: number;
}
