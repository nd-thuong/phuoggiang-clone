import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductTypeService } from './product-type.service';
import { ProductTypeEntity } from './product-type.entity';
import { ResponseResult } from '@/constants/response-result';
import {
  QuerySearchDto,
  QuerySearchProductWith_Brands_Sizes,
} from '@/utils/query-search.dto';
import { ValidationQuery } from '@/middleware/ValidationQuery';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/logger/logger.service';
import { ProductEntity } from '@/app/product/product.entity';

@ApiTags('Product Type')
@Controller('product-types')
export class ProductTypeController {
  constructor(
    private readonly productTypeService: ProductTypeService,
    private readonly _logger: LoggerService,
  ) {}

  @ApiOperation({ summary: 'Get list product type' })
  @UseInterceptors(new ValidationQuery<QuerySearchDto>(QuerySearchDto))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async getAllProductTypes(
    @Query() query: QuerySearchDto,
  ): Promise<ResponseResult<ProductTypeEntity>> {
    const kq = await this.productTypeService.getAll(query);
    return {
      items: kq,
      totalCount: kq.length as number,
    };
  }

  @ApiOperation({ summary: 'Get detail of a product type by id' })
  @Get('/:id')
  async getDetailProductType(
    @Param('id') id: string,
  ): Promise<ProductTypeEntity> {
    // this.logger.info('getting data product type');
    return await this.productTypeService.getDetail(id);
  }

  @ApiOperation({
    summary: 'Get list product with productTypeId and sizeIds, brandIds',
  })
  @UseInterceptors(
    new ValidationQuery<QuerySearchProductWith_Brands_Sizes>(
      QuerySearchProductWith_Brands_Sizes,
    ),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/products/:id')
  async getProduct(
    @Param('id') id: string,
    @Query() query: QuerySearchProductWith_Brands_Sizes,
  ): Promise<ResponseResult<ProductEntity>> {
    const products =
      await this.productTypeService.findProductsByTypeBrandAndSize(id, {
        ...query,
        brandIds: query.brandIds || [],
        sizeIds: query.sizeIds || [],
      });
    return {
      items: products,
      totalCount: products.length,
    };
  }
}
