import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { SizeEntity } from '@/app/sizes/entities/size.entity';
import { SurfaceEntity } from '@/app/surface/entities/surface.entity';
import { BrandEntity } from '@/app/brands/entities/brand.entity';
import { ProductGroupEntity } from '@/app/product-groups/entities/product-group.entity';
import { UnitEntity } from '@/units/entities/unit.entity';
import { toVietnamTimezone } from '@/helpers/request.helper';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '@/utils/Base.entity';
import { ProductTypeEntity } from '../product-type/product-type.entity';

@Entity({
  name: 'products',
})
@Unique(['name'])
export class ProductEntity extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @Column()
  slug: string;

  @Exclude()
  @Column({ nullable: true })
  productTypeId: string | null;

  @ManyToOne(() => ProductTypeEntity, (productType) => productType.products)
  @JoinColumn({ name: 'productTypeId' })
  productType: ProductTypeEntity;

  @Exclude()
  @Column({ nullable: true })
  sizeId: string | null;

  @ManyToOne(() => SizeEntity, (size) => size.products)
  @JoinColumn({ name: 'sizeId' })
  size: SizeEntity;

  @Exclude()
  @Column({ nullable: true })
  surfaceId: string | null;

  @ManyToOne(() => SurfaceEntity, (surface) => surface.products)
  @JoinColumn({ name: 'surfaceId' })
  surface: SurfaceEntity;

  @Exclude()
  @Column({ nullable: true })
  brandId: string | null;

  @ManyToOne(() => BrandEntity, (surface) => surface.products)
  @JoinColumn({ name: 'brandId' })
  brand: BrandEntity;

  @Exclude()
  @Column({ nullable: true })
  productGroupId: string | null;

  @ManyToOne(() => ProductGroupEntity, (productGroup) => productGroup.products)
  @JoinColumn({ name: 'productGroupId' })
  productGroup: ProductGroupEntity;

  @Exclude()
  @Column({ nullable: true })
  unitId: string | null;

  @ManyToOne(() => UnitEntity, (unit) => unit.products)
  @JoinColumn({ name: 'unitId' })
  unit: UnitEntity;

  @BeforeInsert()
  setCreateDate() {
    this.createdAt = toVietnamTimezone(new Date());
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.updatedAt = toVietnamTimezone(new Date());
  }

  @BeforeRemove()
  setDeleteDate() {
    this.deletedAt = toVietnamTimezone(new Date());
  }
}
