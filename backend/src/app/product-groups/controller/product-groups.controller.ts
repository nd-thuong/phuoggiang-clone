import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductGroupsService } from '../product-groups.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductGroupEntity } from '../entities/product-group.entity';
import { plainToInstance } from 'class-transformer';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { ResponseResult } from '@/constants/response-result';

@ApiTags('product-groups')
@Controller('product-groups')
export class ProductGroupsController {
  constructor(private readonly productGroupsService: ProductGroupsService) {}

  @ApiOperation({ summary: 'get list product group' })
  @Get()
  async findAll(
    @Query() query: QuerySearchDto,
  ): Promise<ResponseResult<ProductGroupEntity>> {
    const results = await this.productGroupsService.findAll(query);
    return {
      items: results,
      totalCount: results.length,
    };
  }

  @ApiOperation({ summary: 'get detail product group' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductGroupEntity> {
    const result = await this.productGroupsService.findOne(id);
    return plainToInstance(ProductGroupEntity, result);
  }
}
