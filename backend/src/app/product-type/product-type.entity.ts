import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
  Unique,
} from 'typeorm';
import { ProductEntity } from '../product/product.entity';
// import { BaseEntity } from '@/utils/Base.entity';
import { BaseEntity } from '../../utils/Base.entity';
import { toVietnamTimezone } from '@/helpers/request.helper';

@Unique(['name'])
@Entity({ name: 'product-types' })
export class ProductTypeEntity extends BaseEntity {
  @Column({ length: 50 })
  @Index()
  code: string;

  @Column({ length: 255 })
  @Index()
  name: string;

  @Column({ length: 255 })
  slug: string;

  @OneToMany(() => ProductEntity, (product) => product.productType, {
    onDelete: 'CASCADE',
  })
  products: ProductEntity[];

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
