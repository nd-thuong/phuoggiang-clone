import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SizesService } from '../sizes.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { ResponseResult } from '@/constants/response-result';
import { SizeEntity } from '../entities/size.entity';
import { ValidationQuery } from '@/middleware/ValidationQuery';

@ApiTags('sizes')
@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @ApiOperation({ summary: 'get all sizes' })
  @UseInterceptors(new ValidationQuery<QuerySearchDto>(QuerySearchDto))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async findAll(
    @Query() queryDto: QuerySearchDto,
  ): Promise<ResponseResult<SizeEntity>> {
    const sizes = await this.sizesService.findAll(queryDto);
    return {
      items: sizes,
      totalCount: sizes.length,
    };
  }

  @ApiOperation({ summary: 'get size detail' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SizeEntity> {
    const size = await this.sizesService.findOne(id);
    return size;
  }
}
