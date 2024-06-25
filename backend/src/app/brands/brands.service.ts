import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { BrandEntity } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandEntity)
    private readonly brandRepo: Repository<BrandEntity>,
    @InjectEntityManager()
    private manager: EntityManager,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<BrandEntity> {
    try {
      const brand = this.brandRepo.create(createBrandDto);
      await this.brandRepo.save(brand);
      return brand;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async findAll(valueQuery: QuerySearchDto): Promise<BrandEntity[]> {
    try {
      const { page, take, keySearch, sortOrder } = valueQuery;
      const query = this.brandRepo.createQueryBuilder('brand');
      // query.leftJoinAndSelect('size.products', 'product');
      if (keySearch) {
        query.where('brand.name LIKE :name', {
          name: `%${keySearch}%`,
        });
      }
      query.orderBy('brand.createdAt', sortOrder || 'DESC');
      query.skip((page - 1) * take).take(take);

      return await query.getMany();
    } catch (error) {
      throw new BadRequestException('Đã có lỗi xảy ra');
    }
  }

  async findOne(id: string): Promise<BrandEntity> {
    try {
      const result = await this.brandRepo.findOne({
        where: { id },
        relations: ['products'],
      });
      if (!result) {
        throw new NotFoundException(`Không tìm thấy thương hiệu`);
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandEntity> {
    try {
      const brand = await this.brandRepo.findOneBy({ id });
      if (!brand) {
        throw new NotFoundException('Thương hiệu này không tồn tại');
      }
      brand.name = updateBrandDto.name;
      await this.brandRepo.save(brand);
      return brand;
    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundException('Lỗi id loại sản phẩm');
      }
      throw new BadRequestException(error?.message);
    }
  }

  async remove(id: string): Promise<boolean> {
    return await this.manager.transaction(async (manager) => {
      try {
        const brand = await manager.findOne(BrandEntity, {
          where: { id },
          relations: ['productGroups'],
        });
        if (!brand) {
          throw new NotFoundException('Thương hiệu này không tồn tại');
        }
        if (brand.productGroups.length) {
          throw new ConflictException(
            'Thương hiệu này đang được sử dụng ở nơi khác, không thể xóa',
          );
        }
        await manager.remove(brand);
        return true;
      } catch (error) {
        if (error.code === '23503') {
          // Postgres error code for foreign key violation
          throw new ConflictException(
            'Thương hiệu này đang được sử dụng ở nơi khác, không thể xóa',
          );
        }
        throw new BadRequestException(error?.message);
      }
    });
  }
}
