import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import { UpdateProductGroupDto } from './dto/update-product-group.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ProductGroupEntity } from './entities/product-group.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { BrandEntity } from '@/app/brands/entities/brand.entity';
import { generateName } from '@/utils/generate-code';
import { QuerySearchDto } from '@/utils/query-search.dto';

@Injectable()
export class ProductGroupsService {
  constructor(
    @InjectRepository(ProductGroupEntity)
    private readonly productGroupRepo: Repository<ProductGroupEntity>,
    @InjectRepository(BrandEntity)
    private readonly brandRepo: Repository<BrandEntity>,
    @InjectEntityManager()
    private manager: EntityManager,
  ) {}

  async create(
    createProductGroupDto: CreateProductGroupDto,
  ): Promise<ProductGroupEntity> {
    try {
      const { name, brandIds } = createProductGroupDto;
      const count = await this.productGroupRepo.count();
      const code = generateName('GROUP', count + 1);
      let productGroup = this.productGroupRepo.create({ name, code });
      const brands: BrandEntity[] = [];
      if (brandIds?.length) {
        for (const brandId of brandIds) {
          const brandItem = await this.brandRepo.findOneBy({ id: brandId });
          if (brandItem) {
            brands.push(brandItem);
          }
        }
        productGroup.brands = brands;
        productGroup = await this.productGroupRepo.save(productGroup);
      }
      return productGroup;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async findAll(query: QuerySearchDto): Promise<ProductGroupEntity[]> {
    try {
      const { page, take, keySearch, sortOrder } = query;
      const queryBuilder =
        this.productGroupRepo.createQueryBuilder('productGroup');
      queryBuilder.leftJoinAndSelect('productGroup.brands', 'brand');
      if (keySearch) {
        queryBuilder.where(
          'productGroup.name LIKE :name OR productGroup.code LIKE :code',
          {
            name: `%${keySearch}%`,
            code: `%${keySearch}%`,
          },
        );
      }
      queryBuilder.orderBy('productGroup.createdAt', sortOrder || 'DESC');
      queryBuilder.skip((page - 1) * take).take(take);

      return await queryBuilder.getMany();
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async findOne(id: string): Promise<ProductGroupEntity> {
    try {
      const result = await this.productGroupRepo.findOne({
        where: { id },
        relations: ['brands'],
      });
      if (!result) {
        throw new NotFoundException('Nhóm sản phẩm không tồn tại');
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async update(
    id: string,
    updateProductGroupDto: UpdateProductGroupDto,
  ): Promise<ProductGroupEntity> {
    try {
      const { brandIds, name } = updateProductGroupDto;
      const productGroup = await this.productGroupRepo.findOneBy({ id });
      if (brandIds?.length) {
        const brands = await this.brandRepo.findBy({ id: In(brandIds) });
        productGroup.brands = brands;
        productGroup.name = name;
      }
      await this.productGroupRepo.save(productGroup);
      return productGroup;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async remove(id: string): Promise<boolean> {
    return await this.manager.transaction(async (manager) => {
      try {
        const pdGroup = await this.productGroupRepo.findOneBy({ id });
        await manager.remove(pdGroup);
        return true;
      } catch (error) {
        if (error.code === '23503') {
          // Postgres error code for foreign key violation
          // Handle violation here, perhaps removing or updating child rows first.
          throw new BadRequestException(
            'Có thương hiệu vẫn liên quan đến nhóm sản phẩm bạn muốn xóa',
          );
        }
        throw new BadRequestException(error?.message);
      }
    });
  }
}
