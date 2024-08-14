import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import {
  QuerySearchInventoryDto,
  UpdateInventoryDto,
} from './dto/update-inventory.dto';
import { ProductEntity } from '../product/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryEntity } from './entities/inventory.entity';
import { InventoryEntryEntity } from './entities/inventory_entries.entity';
import { ResponseResult } from '@/constants/response-result';

@Injectable()
export class InventoriesService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productEntity: Repository<ProductEntity>,
    @InjectRepository(InventoryEntity)
    private readonly inventoryEntity: Repository<InventoryEntity>,
    @InjectRepository(InventoryEntryEntity)
    private readonly inventoryEntryEntity: Repository<InventoryEntryEntity>,
  ) {}
  async create(
    createInventoryDto: CreateInventoryDto,
  ): Promise<InventoryEntity> {
    try {
      const { productId, unitId, quantity } = createInventoryDto;
      const itemInventory = await this.inventoryEntity.findOneBy({ productId });
      if (itemInventory?.unitId !== unitId && itemInventory?.unitId) {
        throw new BadRequestException('Đơn vị không đúng');
      }
      const inventoryItem = this.inventoryEntity.create({
        ...createInventoryDto,
      });
      await this.inventoryEntity.save(inventoryItem);
      const product = await this.productEntity.findOne({
        where: { id: productId },
        relations: ['unitConversions'],
      });
      await this.productEntity.save({ ...product, inStock: true });
      // lấy các params cho hàm createEnventoryEntry
      const productInventoryEntry = await this.inventoryEntryEntity.findOneBy({
        productId,
      });
      let reservedQuantity = 0;
      const unitItem = product.unitConversions.find(
        (item) => item.unitId === unitId,
      );
      if (unitItem) {
        reservedQuantity = quantity * unitItem.conversionRate;
      } else {
        reservedQuantity = quantity;
      }
      const currentQuantity = productInventoryEntry?.quantity;
      await this.createEnventoryEntry(
        productId,
        unitId,
        unitItem?.id ? product.unitId : unitId,
        (currentQuantity || 0) + quantity,
        productInventoryEntry?.id
          ? productInventoryEntry.conversionQuantity + reservedQuantity
          : reservedQuantity,
      );
      return inventoryItem;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async findAll(
    valueQuery: QuerySearchInventoryDto,
  ): Promise<ResponseResult<InventoryEntity>> {
    try {
      const { page, take, keySearch, sortOrder, productId, fromDate, toDate } =
        valueQuery;
      const query = this.inventoryEntity
        .createQueryBuilder('inventory')
        .innerJoinAndSelect('inventory.product', 'product')
        .innerJoinAndSelect('inventory.unit', 'unit');
      if (keySearch) {
        query
          .where('product.name ILIKE :name', {
            name: `%${keySearch}%`,
          })
          .orWhere('product.code ILIKE :code', { code: `%${keySearch}` });
      }
      if (productId) {
        query.where('inventory.productId = :productId', {
          productId: productId,
        });
      }
      if (fromDate && toDate) {
        query.andWhere('inventory.createdAt BETWEEN :fromDate AND :toDate', {
          fromDate: fromDate,
          toDate: toDate,
        });
      } else if (fromDate) {
        query.andWhere('inventory.createdAt >= :fromDate', {
          fromDate: fromDate,
        });
      } else if (toDate) {
        query.andWhere('inventory.createdAt <= :toDate', {
          toDate: toDate,
        });
      }
      query.orderBy('inventory.createdAt', sortOrder || 'DESC');
      const [items, totalCount] = await query
        .skip((page - 1) * take)
        .take(take)
        .getManyAndCount();

      return { items, totalCount };
    } catch (error) {
      throw new BadRequestException(error?.meseage);
    }
  }

  async findOne(id: string): Promise<InventoryEntity> {
    try {
      const itemInventory = await this.inventoryEntity.findOneBy({ id });
      if (!itemInventory) {
        throw new NotFoundException('Inventory not found');
      }
      return itemInventory;
    } catch (error) {
      throw new BadRequestException(error?.meseage);
    }
  }

  async update(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<boolean> {
    try {
      const { productId, unitId, quantity, quantityEdit } = updateInventoryDto;
      const itemInventory = await this.inventoryEntity.findOneBy({ id });
      if (itemInventory?.unitId !== unitId && itemInventory?.unitId) {
        throw new BadRequestException('Đơn vị không đúng');
      }
      await this.inventoryEntity.save({
        ...itemInventory,
        quantity: quantityEdit,
        updateInventoryDto,
      });
      await this.updateEnventoryEntry(
        productId,
        unitId,
        quantity,
        quantityEdit,
      );
      return true;
    } catch (error) {
      throw new BadRequestException(error?.meseage);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const itemInventory = await this.inventoryEntity.findOneBy({ id });
      if (!itemInventory) {
        throw new NotFoundException(`Not found inventory`);
      }
      await this.inventoryEntity.remove(itemInventory);
      return true;
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  private async createEnventoryEntry(
    productId: string,
    unitInventoryId: string,
    unitConversionId: string,
    quantity: number,
    reservedQuantity: number,
  ) {
    try {
      const productInventoryEntry = await this.inventoryEntryEntity.findOneBy({
        productId,
      });
      if (productInventoryEntry) {
        // await this.updateEnventoryEntry(
        //   productId,
        //   unitInventoryId,
        //   quantity,
        //   quantity,
        // );
        await this.inventoryEntryEntity.save({
          ...productInventoryEntry,
          quantity,
          conversionQuantity: reservedQuantity,
        });
      } else {
        const data = await this.inventoryEntryEntity.save({
          productId,
          unitInventoryId,
          unitConversionId,
          quantity,
          conversionQuantity: reservedQuantity,
        });
        await this.inventoryEntryEntity.save(data);
      }
    } catch (error) {
      throw new BadRequestException('Lỗi chức năng cập nhật hàng tồn kho');
    }
  }

  private async updateEnventoryEntry(
    productId: string,
    unitId: string,
    quantity: number,
    quantityEdit: number,
  ) {
    try {
      const product = await this.productEntity.findOne({
        where: { id: productId },
        relations: ['unitConversions'],
      });
      const productInventoryEntry = await this.inventoryEntryEntity.findOneBy({
        productId,
      });
      const currentQuantity =
        productInventoryEntry.quantity - quantity + quantityEdit;
      let reservedQuantity = 0;
      const unitItem = product.unitConversions.find(
        (item) => item?.unitId === unitId,
      );
      if (unitItem) {
        reservedQuantity = currentQuantity * unitItem.conversionRate;
      } else {
        reservedQuantity = quantityEdit;
      }
      await this.inventoryEntryEntity.save({
        ...productInventoryEntry,
        quantity: currentQuantity,
        conversionQuantity: reservedQuantity,
      });
    } catch (error) {
      throw new BadRequestException('Lỗi chức năng cập nhật hàng tồn kho');
    }
  }

  async findAllInventoryEntry(
    valueQuery: QuerySearchInventoryDto,
  ): Promise<ResponseResult<InventoryEntryEntity>> {
    try {
      const { page, take, keySearch, sortOrder, fromDate, toDate } = valueQuery;
      const query = this.inventoryEntryEntity
        .createQueryBuilder('inventoryEntry')
        .innerJoinAndSelect('inventoryEntry.product', 'product')
        .innerJoinAndSelect('inventoryEntry.unitConversion', 'unitConversion')
        .innerJoinAndSelect('inventoryEntry.unitInventory', 'unitInventory');
      if (keySearch) {
        query.where('product.name ILIKE :name', {
          name: `%${keySearch}%`,
        });
      }
      if (fromDate && toDate) {
        query.andWhere(
          'inventoryEntry.createdAt BETWEEN :fromDate AND :toDate',
          {
            fromDate: fromDate,
            toDate: toDate,
          },
        );
      } else if (fromDate) {
        query.andWhere('inventoryEntry.createdAt >= :fromDate', {
          fromDate: fromDate,
        });
      } else if (toDate) {
        query.andWhere('inventoryEntry.createdAt <= :toDate', {
          toDate: toDate,
        });
      }
      query.orderBy('inventoryEntry.createdAt', sortOrder || 'DESC');
      const totalCount = (await query.getMany()).length;
      query.skip((page - 1) * take).take(take);
      return {
        items: await query.getMany(),
        totalCount,
      };
    } catch (error) {
      throw new BadRequestException(error?.meseage);
    }
  }

  async removeInventory(productId: string) {
    try {
      const inventories = await this.inventoryEntity.find({
        where: { productId },
      });
      if (inventories.length) {
        for (const item of inventories) {
          await this.inventoryEntity.remove(item);
        }
      }
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }

  async removeInventoryEntry(productId: string) {
    try {
      const item = await this.inventoryEntryEntity.findOneBy({ productId });
      if (item) {
        await this.inventoryEntryEntity.remove(item);
      }
    } catch (error) {
      throw new BadRequestException(error?.message);
    }
  }
}
