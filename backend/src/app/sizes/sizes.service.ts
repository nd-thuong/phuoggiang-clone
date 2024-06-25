import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { SizeEntity } from './entities/size.entity';
import { generateName } from '@/utils/generate-code';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { ProductEntity } from '@/app/product/product.entity';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(SizeEntity)
    private readonly sizeRepo: Repository<SizeEntity>,
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
    @InjectEntityManager()
    private manager: EntityManager,
  ) {}

  async create(createSizeDto: CreateSizeDto): Promise<SizeEntity> {
    try {
      const count = await this.sizeRepo.count();
      const code = generateName('SIZE', count + 1);
      const size = this.sizeRepo.create({ ...createSizeDto, code });
      await this.sizeRepo.save(size);
      return size;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async findAll(valueQuery: QuerySearchDto): Promise<SizeEntity[]> {
    try {
      const { page, take, keySearch, sortOrder } = valueQuery;
      const query = this.sizeRepo.createQueryBuilder('size');
      // query.leftJoinAndSelect('size.products', 'product');
      if (keySearch) {
        query.where('size.name LIKE :name OR size.code LIKE :code', {
          name: `%${keySearch}%`,
          code: `%${keySearch}%`,
        });
      }
      query.orderBy('size.createdAt', sortOrder || 'DESC');
      query.skip((page - 1) * take).take(take);

      return await query.getMany();
    } catch (error) {
      throw new BadRequestException('Đã có lỗi xảy ra');
    }
  }

  async findOne(id: string): Promise<SizeEntity> {
    try {
      const result = await this.sizeRepo.findOne({
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
      throw new BadRequestException(error?.message);
    }
  }

  async update(id: string, updateSizeDto: UpdateSizeDto): Promise<SizeEntity> {
    try {
      const size = await this.sizeRepo.findOneBy({ id });
      if (!size) {
        throw new NotFoundException('Kích thước này không tồn tại');
      }
      size.name = updateSizeDto.name;
      await this.sizeRepo.save(size);
      return size;
    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundException('Lỗi id loại sản phẩm');
      }
      throw new BadRequestException(error?.message);
    }
  }

  async remove(id: string): Promise<boolean> {
    return await this.manager.transaction(async (manager) => {
      const productType = await manager.findOne(SizeEntity, { where: { id } });
      if (!productType) {
        throw new NotFoundException('Kích thước này không tồn tại');
      }
      try {
        await manager.remove(productType);
        return true;
      } catch (error) {
        if (error.code === '23503') {
          // Postgres error code for foreign key violation
          // Handle violation here, perhaps removing or updating child rows first.
          throw new BadRequestException(
            'Có sản phẩm vẫn liên quan đến kích thước bạn muốn xóa',
          );
        }
        throw new BadRequestException(error?.message);
      }
    });
  }
}
