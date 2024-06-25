import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BrandService } from '../brands.service';
import { BrandEntity } from '../entities/brand.entity';
import { ResponseResult } from '@/constants/response-result';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { ValidationQuery } from '@/middleware/ValidationQuery';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandService: BrandService) {}

  @UseInterceptors(new ValidationQuery<QuerySearchDto>(QuerySearchDto))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async findAll(
    @Query() query: QuerySearchDto,
  ): Promise<ResponseResult<BrandEntity>> {
    const brands = await this.brandService.findAll(query);
    return {
      items: brands,
      totalCount: brands.length,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BrandEntity> {
    return await this.brandService.findOne(id);
  }
}
