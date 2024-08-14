import { ProductEntity } from '@/app/product/entities/product.entity';
import { UnitEntity } from '@/app/units/entities/unit.entity';
import { BaseEntity } from '@/utils/Base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('inventories')
export class InventoryEntity extends BaseEntity {
  @Column()
  productId: string;
  @ManyToOne(() => ProductEntity, (product) => product.inventories, {
    eager: true,
  })
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column()
  unitId: string;
  @ManyToOne(() => UnitEntity, { eager: true }) // eager: true Tự động tải dữ liệu liên quan từ bảng Unit
  @JoinColumn({ name: 'unitId' })
  unit: UnitEntity;

  @Column({ default: 0 }) // số lượng quy đổi
  quantity: number;

  @Column({ nullable: true })
  note: string;
}
