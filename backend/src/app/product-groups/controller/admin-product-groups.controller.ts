import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { ProductGroupsService } from '../product-groups.service';
import { CreateProductGroupDto } from '../dto/create-product-group.dto';
import { UpdateProductGroupDto } from '../dto/update-product-group.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '@/guards/jwt-authentication.guard';
import { RolesGuard } from '@/guards/role.guard';
import { ValidationBodyData } from '@/middleware/ValidationBodyData';
import { ProductGroupEntity } from '../entities/product-group.entity';
import { plainToInstance } from 'class-transformer';

@ApiTags('product-groups')
@UseGuards(JwtAuthenticationGuard)
@Controller('product-groups')
export class AdminProductGroupsController {
  constructor(private readonly productGroupsService: ProductGroupsService) {}

  @ApiOperation({ summary: 'create product group' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(
    new ValidationBodyData<CreateProductGroupDto>(CreateProductGroupDto),
  )
  @Post()
  async create(
    @Body() createProductGroupDto: CreateProductGroupDto,
  ): Promise<ProductGroupEntity> {
    const result = await this.productGroupsService.create(
      createProductGroupDto,
    );
    return plainToInstance(ProductGroupEntity, result);
  }

  @ApiOperation({ summary: 'update product group' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(
    new ValidationBodyData<UpdateProductGroupDto>(UpdateProductGroupDto),
  )
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductGroupDto: UpdateProductGroupDto,
  ): Promise<ProductGroupEntity> {
    const result = await this.productGroupsService.update(
      id,
      updateProductGroupDto,
    );
    return plainToInstance(ProductGroupEntity, result);
  }

  @ApiOperation({ summary: 'remove product group' })
  @UseGuards(RolesGuard(['admin']))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productGroupsService.remove(id);
  }
}
