import { ProductEntity } from '@/app/product/product.entity';

export interface ResponseResult<T = ProductEntity> {
  items: T[];
  totalCount: number;
}
