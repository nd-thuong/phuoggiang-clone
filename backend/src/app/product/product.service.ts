import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductDto, QuerySearchProduct } from './dto/product-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createSlug } from '@/utils/generate-slug';
import { ProductEntity } from './entities/product.entity';
import { UnitConversionEntity } from './entities/unit-conversions.entity';
import { generateName } from '@/utils/generate-code';
import { UnitConversionDto } from './dto/unit-conversion.dto';
import { InventoriesService } from '../inventories/inventories.service';
import { isJSON } from 'class-validator';
import { RemoveFileDto } from '../upload-files/dto/upload-file.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ResponseResult } from '@/constants/response-result';
import { BooleanSearchEnum } from '@/utils/enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntity: Repository<ProductEntity>,
    @InjectRepository(UnitConversionEntity)
    private readonly unitConversionEntity: Repository<UnitConversionEntity>,
    private readonly inventoryService: InventoriesService,
    private readonly httpService: HttpService,
    private _configService: ConfigService,
  ) {}

  async createProduct(data: ProductDto): Promise<ProductEntity> {
    try {
      const { unitConversions, ...rest } = data;
      const count = await this.productEntity.count();
      const product = this.productEntity.create({
        ...rest,
        slug: createSlug(data.name),
        code: generateName('SP', count === 0 ? 1 : count + 1),
      });
      const result = await this.productEntity.save(product);
      if (unitConversions.length) {
        for (const itemConversion of unitConversions) {
          const unitConversion = this.unitConversionEntity.create({
            conversionRate: itemConversion.conversionRate,
            retailPrice: itemConversion.retailPrice,
            wholesalePrice: itemConversion.wholesalePrice,
            unitId: itemConversion.unitId,
            productId: result.id,
          });
          await this.unitConversionEntity.save(unitConversion);
        }
      }
      return product;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async updateProduct(data: ProductDto, id: string): Promise<ProductEntity> {
    try {
      const { unitConversions, ...rest } = data;
      const product = await this.productEntity.findOne({
        where: { id },
        relations: ['unitConversions'],
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      await this.removeUnitConversion(product.unitConversions, unitConversions);
      const dataUpdate = {
        ...product,
        ...rest,
        slug: createSlug(data.name),
      };
      await this.productEntity.save({
        ...dataUpdate,
      } as ProductEntity);
      if (unitConversions.length) {
        for (const itemConversion of unitConversions) {
          if (itemConversion.id) {
            const itemConversionEnity =
              await this.unitConversionEntity.findOneBy({
                id: itemConversion.id,
              });
            await this.unitConversionEntity.save({
              ...itemConversionEnity,
              ...itemConversion,
            });
          } else {
            const unitConversion = this.unitConversionEntity.create({
              conversionRate: itemConversion.conversionRate,
              retailPrice: itemConversion.retailPrice,
              wholesalePrice: itemConversion.wholesalePrice,
              unitId: itemConversion.unitId,
              productId: product.id,
            });
            await this.unitConversionEntity.save(unitConversion);
          }
        }
      }
      return product;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async getAll(
    valueQuery: QuerySearchProduct,
  ): Promise<ResponseResult<ProductEntity>> {
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
        showHomePage,
        isBestSeller,
        isNew,
      } = valueQuery;

      const query = this.productEntity
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.productType', 'productType')
        .leftJoinAndSelect('product.size', 'size')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('product.surface', 'surface')
        .leftJoinAndSelect('product.productGroup', 'productGroup')
        .leftJoinAndSelect('product.baseUnit', 'baseUnit');

      const booleanConditions = [
        { field: 'showHomePage', value: showHomePage },
        { field: 'isNew', value: isNew },
        { field: 'isBestSeller', value: isBestSeller },
      ];

      booleanConditions.forEach(({ field, value }) => {
        if (value === BooleanSearchEnum.YES || value === BooleanSearchEnum.NO) {
          query.andWhere(`product.${field} = :${field}`, {
            [field]: value === BooleanSearchEnum.YES,
          });
        }
      });

      if (keySearch) {
        query.andWhere('product.name ILIKE :name', { name: `%${keySearch}%` });
      }

      const filterConditions = {
        productTypeId,
        productGroupId,
        brandId,
      };

      Object.entries(filterConditions).forEach(([key, value]) => {
        if (value) {
          query.andWhere(`product.${key} = :${key}`, { [key]: value });
        }
      });

      if (fromDate && toDate) {
        query.andWhere('product.createdAt BETWEEN :fromDate AND :toDate', {
          fromDate: new Date(fromDate).toISOString(),
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
      const [items, totalCount] = await query
        .skip((page - 1) * take)
        .take(take)
        .getManyAndCount();

      return { items, totalCount };
    } catch (error) {
      throw new BadGatewayException(error?.message);
    }
  }

  async getDetailProduct(id: string): Promise<ProductEntity> {
    try {
      const product = await this.productEntity.findOne({
        where: { id },
        relations: [
          'productType',
          'size',
          'surface',
          'unitConversions',
          'unitConversions.unit',
          'baseUnit',
        ],
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
      const product = await this.productEntity.findOne({
        where: { id },
        relations: ['unitConversions'],
      });
      if (!product) {
        throw new NotFoundException(`Not found product with id ${id}`);
      }
      if (product.unitConversions.length) {
        for (const itemConversion of product.unitConversions) {
          await this.unitConversionEntity.remove(itemConversion);
        }
      }
      if (isJSON(product.images)) {
        const images: RemoveFileDto[] = JSON.parse(product.images);
        for (const image of images) {
          if (image.url.includes('files/')) {
            await firstValueFrom(
              this.httpService.patch(
                `${this._configService.get('APP_API_DOMAIN')}/upload-local`,
                { filename: image.filename, id: image.id },
              ),
            );
          }
          if (image.url.includes('cloudinary')) {
            await firstValueFrom(
              this.httpService.patch(
                `${this._configService.get(
                  'APP_API_DOMAIN',
                )}/cloudinary-upload`,
                { filename: image.filename, id: image.id },
              ),
            );
          }
        }
      }
      await this.inventoryService.removeInventory(id);
      await this.inventoryService.removeInventoryEntry(id);
      await this.productEntity.remove(product);
      const products = await this.productEntity.find();
      products.forEach(async (item, index) => {
        await this.productEntity.save({
          ...item,
          code: generateName('SP', index + 1),
        });
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  private async removeUnitConversion(
    oldConversion: UnitConversionEntity[],
    newConversion: UnitConversionDto[],
  ) {
    if (oldConversion.length) {
      for (const itemConversion of oldConversion) {
        const kq = newConversion.find((item) => item.id === itemConversion.id);
        if (!kq) {
          await this.unitConversionEntity.remove(itemConversion);
        }
      }
    }
  }
}
