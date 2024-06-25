import { BrandEntity } from '@/app/brands/entities/brand.entity';
import { toVietnamTimezone } from '@/helpers/request.helper';
import { ProductEntity } from '@/app/product/product.entity';
import { BaseEntity } from '@/utils/Base.entity';
import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity('product-groups')
export class ProductGroupEntity extends BaseEntity {
  @Column()
  @Index()
  code: string;

  @Column()
  @Index()
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.productGroup)
  products: ProductEntity[];

  @ManyToMany(() => BrandEntity, (brand) => brand.productGroups)
  brands: BrandEntity[];

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
