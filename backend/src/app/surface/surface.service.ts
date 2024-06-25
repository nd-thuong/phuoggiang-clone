import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { generateName } from '@/utils/generate-code';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { SurfaceEntity } from './entities/surface.entity';
import { CreateSurfaceDto } from './dto/create-surface.dto';
import { UpdateSurfaceDto } from './dto/update-surface.dto';

@Injectable()
export class SurfaceService {
  constructor(
    @InjectRepository(SurfaceEntity)
    private readonly surfaceRepo: Repository<SurfaceEntity>,
    @InjectEntityManager()
    private manager: EntityManager,
  ) {}

  async create(createSurfaceDto: CreateSurfaceDto): Promise<SurfaceEntity> {
    try {
      const count = await this.surfaceRepo.count();
      const code = generateName('XG', count + 1);
      const surface = this.surfaceRepo.create({ ...createSurfaceDto, code });
      await this.surfaceRepo.save(surface);
      return surface;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async findAll(valueQuery: QuerySearchDto): Promise<SurfaceEntity[]> {
    try {
      const { page, take, keySearch, sortOrder } = valueQuery;
      const query = this.surfaceRepo.createQueryBuilder('surface');
      // query.leftJoinAndSelect('surface.products', 'product');
      if (keySearch) {
        query.where('surface.name LIKE :name OR surface.code LIKE :code', {
          name: `%${keySearch}%`,
          code: `%${keySearch}%`,
        });
      }
      query.orderBy('surface.createdAt', sortOrder || 'DESC');
      query.skip((page - 1) * take).take(take);

      return await query.getMany();
    } catch (error) {
      throw new BadRequestException('Đã có lỗi xảy ra');
    }
  }

  async findOne(id: string): Promise<SurfaceEntity> {
    try {
      const result = await this.surfaceRepo.findOne({
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

  async update(
    id: string,
    updateSurfaceDto: UpdateSurfaceDto,
  ): Promise<SurfaceEntity> {
    try {
      const surface = await this.surfaceRepo.findOneBy({ id });
      if (!surface) {
        throw new NotFoundException('Kích thước này không tồn tại');
      }
      surface.name = updateSurfaceDto.name;
      await this.surfaceRepo.save(surface);
      return surface;
    } catch (error) {
      if (error.code === '22P02') {
        throw new NotFoundException('Lỗi id loại sản phẩm');
      }
      throw new BadRequestException(error?.message);
    }
  }

  async remove(id: string): Promise<boolean> {
    return await this.manager.transaction(async (manager) => {
      const productType = await manager.findOne(SurfaceEntity, {
        where: { id },
      });
      if (!productType) {
        throw new NotFoundException('Loại bề mặt này không tồn tại');
      }
      try {
        await manager.remove(productType);
        return true;
      } catch (error) {
        if (error.code === '23503') {
          // Postgres error code for foreign key violation
          // Handle violation here, perhaps removing or updating child rows first.
          throw new BadRequestException(
            'Có sản phẩm vẫn liên quan đến loại bề mặt bạn muốn xóa',
          );
        }
        throw new BadRequestException(error?.message);
      }
    });
  }
}
