import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseResult } from '@/constants/response-result';
import { ValidationQuery } from '@/middleware/ValidationQuery';
import { QuerySearchProduct } from './product-dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: 'get all product' })
  @UseInterceptors(new ValidationQuery<QuerySearchProduct>(QuerySearchProduct))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async getAllProducts(
    @Query() query: QuerySearchProduct,
  ): Promise<ResponseResult<ProductEntity>> {
    const products = await this.productService.getAll(query);
    return {
      items: products,
      totalCount: products.length,
    };
  }

  @ApiOperation({ summary: 'get detail product' })
  @Get('/:id')
  async getDetailProduct(@Param('id') id: string): Promise<ProductEntity> {
    return this.productService.getDetailProduct(id);
  }
}
