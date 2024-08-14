import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  Put,
} from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import {
  QuerySearchInventoryDto,
  UpdateInventoryDto,
} from './dto/update-inventory.dto';
import { JwtAuthenticationGuard } from '@/guards/jwt-authentication.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '@/guards/role.guard';
import { ValidationBodyData } from '@/middleware/ValidationBodyData';
import { InventoryEntity } from './entities/inventory.entity';
import { ResponseResult } from '@/constants/response-result';
import { InventoryEntryEntity } from './entities/inventory_entries.entity';

@ApiTags('inventories')
@UseGuards(JwtAuthenticationGuard)
@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @ApiOperation({ summary: 'Enter products into warehouse' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(
    new ValidationBodyData<CreateInventoryDto>(CreateInventoryDto),
  )
  @Post()
  async create(
    @Body() createInventoryDto: CreateInventoryDto,
  ): Promise<InventoryEntity> {
    return await this.inventoriesService.create(createInventoryDto);
  }

  @UseGuards(RolesGuard(['admin']))
  @Get()
  async findAll(
    @Query() query: QuerySearchInventoryDto,
  ): Promise<ResponseResult<InventoryEntity>> {
    const data = await this.inventoriesService.findAll(query);
    return {
      items: data.items,
      totalCount: data.totalCount,
    };
  }

  @UseGuards(RolesGuard(['admin']))
  @Get('/entries')
  async findAllInventoryEntry(
    @Query() query: QuerySearchInventoryDto,
  ): Promise<ResponseResult<InventoryEntryEntity>> {
    const data = await this.inventoriesService.findAllInventoryEntry(query);
    return {
      items: data.items,
      totalCount: data.totalCount,
    };
  }

  @UseGuards(RolesGuard(['admin']))
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InventoryEntity> {
    return await this.inventoriesService.findOne(id);
  }

  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(
    new ValidationBodyData<UpdateInventoryDto>(UpdateInventoryDto),
  )
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<boolean> {
    return await this.inventoriesService.update(id, updateInventoryDto);
  }

  @UseGuards(RolesGuard(['admin']))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.inventoriesService.remove(id);
  }
}
