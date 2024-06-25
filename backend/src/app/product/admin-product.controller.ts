import { JwtAuthenticationGuard } from '@/guards/jwt-authentication.guard';
import { RolesGuard } from '@/guards/role.guard';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductDto } from './product-dto';
import { ProductService } from './product.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductEntity } from './product.entity';
import { ValidationBodyData } from '@/middleware/ValidationBodyData';

@ApiTags('products')
@UseGuards(JwtAuthenticationGuard)
@Controller('products')
export class AdminProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: 'create product' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<ProductDto>(ProductDto))
  @Post()
  async createProduct(@Body() data: ProductDto): Promise<ProductEntity> {
    return await this.productService.createProduct(data);
  }

  @ApiOperation({ summary: 'update product' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<ProductDto>(ProductDto))
  @Put('/:id')
  async updateProduct(
    @Body() data: ProductDto,
    @Param('id') id: string,
  ): Promise<ProductEntity> {
    return await this.productService.updateProduct(data, id);
  }

  @ApiOperation({ summary: 'remove product' })
  @UseGuards(RolesGuard(['admin']))
  @Delete('/:id')
  async removeProduct(@Param('id') id: string): Promise<boolean> {
    return this.productService.removeProduct(id);
  }
}
