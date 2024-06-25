import {
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SurfaceService } from '../surface.service';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { SurfaceEntity } from '../entities/surface.entity';
import { ResponseResult } from '@/constants/response-result';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationQuery } from '@/middleware/ValidationQuery';

@ApiTags('surfaces')
@Controller('surfaces')
export class SurfaceController {
  constructor(private readonly surfaceService: SurfaceService) {}

  @ApiOperation({ summary: 'get all surface' })
  @UseInterceptors(new ValidationQuery<QuerySearchDto>(QuerySearchDto))
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async findAll(
    @Query() query: QuerySearchDto,
  ): Promise<ResponseResult<SurfaceEntity>> {
    const data = await this.surfaceService.findAll(query);
    return {
      items: data,
      totalCount: data.length,
    };
  }

  @ApiOperation({ summary: 'get surface detail' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SurfaceEntity> {
    const data = await this.surfaceService.findOne(id);
    return data;
  }
}
