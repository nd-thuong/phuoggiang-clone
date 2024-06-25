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
  OneToMany,
} from 'typeorm';

@Entity('units')
export class UnitEntity extends BaseEntity {
  @Column()
  @Index()
  name: string;

  @OneToMany(() => ProductEntity, (product) => product.unit)
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
