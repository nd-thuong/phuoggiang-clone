import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductEntity } from './product.entity';
import { ProductDto, QuerySearchProduct } from './product-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createSlug } from '@/utils/generate-slug';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntity: Repository<ProductEntity>,
  ) {}

  async createProduct(data: ProductDto): Promise<ProductEntity> {
    try {
      const product = this.productEntity.create({
        ...data,
        slug: createSlug(data.name),
      });
      await this.productEntity.save(product);
      return product;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async updateProduct(data: ProductDto, id: string): Promise<ProductEntity> {
    try {
      const product = await this.productEntity.findOneBy({ id });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      const dataUpdate = {
        ...product,
        ...data,
        slug: createSlug(data.name),
      };
      await this.productEntity.save(dataUpdate as ProductEntity);
      // const kq = await this.productEntity.update(product.id, dataUpdate);
      return dataUpdate as ProductEntity;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async getAll(valueQuery: QuerySearchProduct): Promise<Array<ProductEntity>> {
    try {
      const {
        page,
        take,
        keySearch,
        sortOrder,
        fromDate,
        toDate,
        productTypeId,
        productGroupId,
        brandId,
      } = valueQuery;
      const query = this.productEntity.createQueryBuilder('product');
      // Kết nối với bảng "product-type" thông qua mối quan hệ
      query
        .leftJoinAndSelect('product.productType', 'productType')
        .leftJoinAndSelect('product.size', 'size')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.surface', 'surface')
        .leftJoinAndSelect('product.productGroup', 'productGroup')
        .leftJoinAndSelect('product.unit', 'unit');
      if (keySearch) {
        query.where('product.name LIKE :name', {
          name: `%${keySearch}%`,
        });
      }
      if (productTypeId) {
        query.andWhere('product.productTypeId = :productTypeId', {
          productTypeId,
        });
      }

      if (productGroupId) {
        query.andWhere('product.productGroupId = :productGroupId', {
          productGroupId,
        });
      }

      if (brandId) {
        query.andWhere('product.brandId = :brandId', { brandId });
      }
      if (fromDate && toDate) {
        query.andWhere('product.createdAt BETWEEN :fromDate AND :toDate', {
          fromDate,
          toDate: new Date(toDate).toISOString(), // Đảm bảo rằng ngày kết thúc bao gồm cả ngày đó
        });
      } else if (fromDate) {
        // Tìm kiếm từ ngày
        query.andWhere('product.createdAt >= :fromDate', { fromDate });
      } else if (toDate) {
        // Tìm kiếm đến ngày
        query.andWhere('product.createdAt <= :toDate', {
          toDate: new Date(toDate).toISOString(),
        });
      }
      query.orderBy('product.createdAt', sortOrder || 'DESC');
      query.skip((page - 1) * take).take(take);
      return await query.getMany();
    } catch (error) {
      throw new BadGatewayException(error?.message);
    }
  }

  async getDetailProduct(id: string): Promise<ProductEntity> {
    try {
      const product = this.productEntity.findOne({
        where: { id },
        relations: ['productType', 'size', 'surface'],
      });
      if (!product) {
        throw new NotFoundException(`Không tìm thấy sản phẩm có ID ${id}`);
      }
      return product;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async removeProduct(id: string): Promise<boolean> {
    try {
      const product = await this.productEntity.findOneBy({ id });
      if (!product) {
        throw new NotFoundException(`Not found product with id ${id}`);
      }
      await this.productEntity.remove(product);
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }
}
