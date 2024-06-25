import { toVietnamTimezone } from '@/helpers/request.helper';
import { ProductGroupEntity } from '@/app/product-groups/entities/product-group.entity';
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
  Unique,
} from 'typeorm';

@Unique(['name'])
@Entity('brands')
export class BrandEntity extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.brand)
  products: ProductEntity[];

  @ManyToMany(() => ProductGroupEntity, (productGroup) => productGroup.brands, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  productGroups: ProductGroupEntity[];

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
