import { ProductEntity } from '@/app/product/entities/product.entity';

export interface ResponseResult<T = ProductEntity> {
  items: T[];
  totalCount: number;
}
