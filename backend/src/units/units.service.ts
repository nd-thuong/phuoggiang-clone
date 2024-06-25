import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { UnitEntity } from './entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(UnitEntity)
    private readonly unitRepo: Repository<UnitEntity>,
    @InjectEntityManager()
    private manager: EntityManager,
  ) {}

  async create(createUnitDto: CreateUnitDto): Promise<UnitEntity> {
    try {
      const unit = this.unitRepo.create({ ...createUnitDto });
      await this.unitRepo.save(unit);
      return unit;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async findAll(valueQuery: QuerySearchDto): Promise<UnitEntity[]> {
    try {
      const { page, take, keySearch, sortOrder } = valueQuery;
      const query = this.unitRepo.createQueryBuilder('unit');
      // query.leftJoinAndSelect('unit.products', 'product');
      if (keySearch) {
        query.where('unit.name LIKE :name', {
          name: `%${keySearch}%`,
        });
      }
      query.orderBy('unit.createdAt', sortOrder || 'DESC');
      query.skip((page - 1) * take).take(take);

      return await query.getMany();
    } catch (error) {
      throw new BadRequestException(error?.meseage);
    }
  }

  async findOne(id: string): Promise<UnitEntity> {
    try {
      const result = await this.unitRepo.findOne({
        where: { id },
        relations: ['products'],
      });
      if (!result) {
        throw new NotFoundException(`Không tìm thấy dơn vị với id ${id}`);
      }
      return result;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<UnitEntity> {
    try {
      const size = await this.unitRepo.findOneBy({ id });
      if (!size) {
        throw new NotFoundException('Đơn vị này không tồn tại');
      }
      size.name = updateUnitDto.name;
      await this.unitRepo.save(size);
      return size;
    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundException('Lỗi id đơn vị');
      }
      throw new BadRequestException(error?.message);
    }
  }

  async remove(id: string): Promise<boolean> {
    return await this.manager.transaction(async (manager) => {
      const unit = await manager.findOne(UnitEntity, {
        where: { id },
      });
      if (!unit) {
        throw new NotFoundException('Đơn vị này không tồn tại');
      }
      try {
        await manager.remove(unit);
        return true;
      } catch (error) {
        if (error.code === '23503') {
          // Postgres error code for foreign key violation
          // Handle violation here, perhaps removing or updating child rows first.
          throw new BadRequestException(
            'Có sản phẩm vẫn liên quan đến đơn vị bạn muốn xóa',
          );
        }
        throw new BadRequestException(error?.message);
      }
    });
  }
}
