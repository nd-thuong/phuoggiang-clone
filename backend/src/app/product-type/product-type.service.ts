import { ProductTypeEntity } from './product-type.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { ProductTypeDto } from './product-type.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  QuerySearchDto,
  QuerySearchProductWith_Brands_Sizes,
} from '@/utils/query-search.dto';
import { createSlug } from '@/utils/generate-slug';
import { generateName } from '@/utils/generate-code';
import { ProductEntity } from '@/app/product/product.entity';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductTypeEntity)
    private readonly productTypeRepo: Repository<ProductTypeEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    @InjectEntityManager()
    private manager: EntityManager,
  ) {}

  async createProductType(data: ProductTypeDto) {
    try {
      const count = await this.productTypeRepo.count();
      const code = generateName('LSP', count + 1);
      const result = this.productTypeRepo.create({
        ...data,
        code,
        slug: createSlug(data.name),
      });
      await this.productTypeRepo.save(result);
      return result;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Đã tồn tại mã loại sản phẩm');
      } else {
        throw new BadRequestException(error?.message);
      }
    }
  }

  async updateProductType(
    data: ProductTypeDto,
    id: string,
  ): Promise<ProductTypeEntity> {
    try {
      const productType = await this.productTypeRepo.findOneBy({ id });
      const dataUpdate = Object.assign(productType, {
        ...data,
        slug: createSlug(data.name),
      });
      const result = await this.productTypeRepo.save(dataUpdate);
      return result;
    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundException('Lỗi id loại sản phẩm');
      }
      throw new BadRequestException(error?.message);
    }
  }

  async deleteProductType(id: string): Promise<boolean> {
    return await this.manager.transaction(async (manager) => {
      const productType = await manager.findOne(ProductTypeEntity, {
        where: { id },
      });
      if (!productType) {
        throw new NotFoundException('Loại sản phẩm này không tồn tại');
      }
      try {
        await manager.remove(productType);
        return true;
      } catch (error) {
        if (error.code === '23503') {
          // Postgres error code for foreign key violation
          // Handle violation here, perhaps removing or updating child rows first.
          throw new BadRequestException(
            'Có sản phẩm vẫn liên quan đến loại sản phẩm bạn muốn xóa',
          );
        }
        throw new BadRequestException(error?.message);
      }
    });
  }

  async getAll(valueQuery: QuerySearchDto): Promise<ProductTypeEntity[]> {
    try {
      const { page, take, keySearch, sortOrder } = valueQuery;
      const query = this.productTypeRepo.createQueryBuilder('productType');
      // query.leftJoinAndSelect('productType.products', 'product');
      if (keySearch) {
        query.where(
          'productType.name LIKE :name OR productType.code LIKE :code',
          { name: `%${keySearch}%`, code: `%${keySearch}%` },
        );
      }
      query.orderBy('productType.createdAt', sortOrder || 'DESC');
      query.skip((page - 1) * take).take(take);

      return await query.getMany();
    } catch (error) {
      throw new BadRequestException('Đã có lỗi xảy ra');
    }
  }

  async getDetail(id: string): Promise<ProductTypeEntity> {
    try {
      const result = await this.productTypeRepo.findOne({
        where: { id },
        relations: ['products'],
      });
      if (!result) {
        throw new NotFoundException(
          `Không tìm thấy loại sản phẩm với id ${id}`,
        );
      }
      return result;
    } catch (error) {
      throw new NotFoundException('Không tìm thấy loại sản phẩm này');
    }
  }
  async findProductsByTypeBrandAndSize(
    productTypeId: string,
    query: QuerySearchProductWith_Brands_Sizes,
  ): Promise<ProductEntity[]> {
    try {
      const { brandIds, sizeIds, page, take, sortOrder } = query;
      let queryBuilder = this.productRepo.createQueryBuilder('product');
      queryBuilder = queryBuilder
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.size', 'size')
        .leftJoinAndSelect('product.productType', 'productType')
        .where('productType.id = :productTypeId', { productTypeId });

      // Kiểm tra và thêm điều kiện cho `brandIds` hoặc `sizeIds` nếu có
      if (brandIds.length > 0 && sizeIds.length > 0) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('product.brandId IN (:...brandIds)', { brandIds }).orWhere(
              'size.id IN (:...sizeIds)',
              { sizeIds },
            );
          }),
        );
      } else if (brandIds.length > 0) {
        queryBuilder = queryBuilder.andWhere(
          'product.brandId IN (:...brandIds)',
          {
            brandIds,
          },
        );
      } else if (sizeIds.length > 0) {
        queryBuilder = queryBuilder.andWhere('size.id IN (:...sizeIds)', {
          sizeIds,
        });
      }
      queryBuilder.orderBy('productType.createdAt', sortOrder || 'DESC');
      queryBuilder.skip((page - 1) * take).take(take);
      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
