import { BaseEntity } from '@/utils/Base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProductEntity } from './product.entity';
import { UnitEntity } from '@/app/units/entities/unit.entity';

@Entity({ name: 'unitConversions' })
export class UnitConversionEntity extends BaseEntity {
  @Column()
  productId: string;
  @ManyToOne(() => ProductEntity, (unit) => unit.unitConversions)
  @JoinColumn({ name: 'productId' })
  product: ProductEntity;

  @Column({ nullable: true })
  unitId: string | null;
  @ManyToOne(() => UnitEntity, (unit) => unit.unitConversions)
  @JoinColumn({ name: 'unitId' })
  unit: UnitEntity;

  @Column()
  conversionRate: number;

  @Column()
  retailPrice: number;

  @Column()
  wholesalePrice: number;
}
