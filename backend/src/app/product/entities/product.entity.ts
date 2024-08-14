import {
  // BeforeInsert,
  // BeforeRemove,
  // BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { SizeEntity } from '@/app/sizes/entities/size.entity';
import { SurfaceEntity } from '@/app/surface/entities/surface.entity';
import { BrandEntity } from '@/app/brands/entities/brand.entity';
import { ProductGroupEntity } from '@/app/product-groups/entities/product-group.entity';
import { UnitEntity } from '@/app/units/entities/unit.entity';
// import { toVietnamTimezone } from '@/helpers/request.helper';
import { BaseEntity } from '@/utils/Base.entity';
import { ProductTypeEntity } from '@/app/product-type/product-type.entity';
import { UnitConversionEntity } from './unit-conversions.entity';
import { InventoryEntity } from '@/app/inventories/entities/inventory.entity';

@Entity({
  name: 'products',
})
@Unique(['code'])
export class ProductEntity extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @Column()
  @Index()
  code: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  images: string | null;

  @Column({ nullable: true })
  videoLink: string;

  @Column({ default: false })
  showHomePage: boolean;

  @Column()
  retailPrice: number;

  @Column()
  wholesalePrice: number;

  @Column('decimal', { precision: 10, scale: 3, default: 0 })
  warrantyPeriod: number;

  @Column({ default: false })
  isBestSeller: boolean;

  @Column({ default: false })
  inStock: boolean;

  @Column({ default: false })
  isNew: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isPromotion: boolean;

  @Column({ default: 0 })
  percentPromotion: number;

  @Column({ nullable: true })
  productTypeId: string | null;

  @ManyToOne(() => ProductTypeEntity, (productType) => productType.products)
  @JoinColumn({ name: 'productTypeId' })
  productType: ProductTypeEntity;

  @Column({ nullable: true })
  sizeId: string | null;

  @ManyToOne(() => SizeEntity, (size) => size.products)
  @JoinColumn({ name: 'sizeId' })
  size: SizeEntity;

  @Column({ nullable: true })
  surfaceId: string | null;

  @ManyToOne(() => SurfaceEntity, (surface) => surface.products)
  @JoinColumn({ name: 'surfaceId' })
  surface: SurfaceEntity;

  @Column({ nullable: true })
  brandId: string | null;

  @ManyToOne(() => BrandEntity, (surface) => surface.products)
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @Column({ nullable: true })
  productGroupId: string | null;

  @ManyToOne(() => ProductGroupEntity, (productGroup) => productGroup.products)
  @JoinColumn({ name: 'productGroupId' })
  productGroup: ProductGroupEntity;

  @Column({ nullable: true })
  unitId: string | null;

  @ManyToOne(() => UnitEntity, (unit) => unit.products)
  @JoinColumn({ name: 'unitId' })
  baseUnit: UnitEntity;

  @OneToMany(
    () => UnitConversionEntity,
    (unitConversion) => unitConversion.product,
  )
  unitConversions: UnitConversionEntity[];

  @OneToMany(() => InventoryEntity, (inventory) => inventory.product)
  inventories: InventoryEntity[];

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
