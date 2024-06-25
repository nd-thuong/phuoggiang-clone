import { ProductTypeEntity } from './product-type.entity';
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
import { ProductTypeService } from './product-type.service';
import { ProductTypeDto } from './product-type.dto';
import { JwtAuthenticationGuard } from '@/guards/jwt-authentication.guard';
import { RolesGuard } from '@/guards/role.guard';
import { plainToClass } from 'class-transformer';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationBodyData } from '@/middleware/ValidationBodyData';

@ApiBearerAuth()
@ApiTags('Product Type')
@UseGuards(JwtAuthenticationGuard)
@Controller('product-types')
export class AdminProductTypeController {
  constructor(private readonly service: ProductTypeService) {}

  @ApiOperation({ summary: 'Create product type' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<ProductTypeDto>(ProductTypeDto))
  @Post()
  async create(@Body() data: ProductTypeDto) {
    return this.service.createProductType(data);
  }

  @ApiOperation({ summary: 'Update product type by id' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<ProductTypeDto>(ProductTypeDto))
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() data: ProductTypeDto,
  ): Promise<ProductTypeEntity> {
    const result = await this.service.updateProductType(data, id);
    return plainToClass(ProductTypeEntity, result);
  }

  @ApiOperation({ summary: 'Remove product type by id' })
  @UseGuards(RolesGuard(['admin']))
  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.service.deleteProductType(id);
  }
}
