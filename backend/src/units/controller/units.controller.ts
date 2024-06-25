import { Controller, Get, Param, Query } from '@nestjs/common';
import { UnitService } from '../units.service';
import { QuerySearchDto } from '@/utils/query-search.dto';
import { ResponseResult } from '@/constants/response-result';
import { UnitEntity } from '../entities/unit.entity';
import { plainToInstance } from 'class-transformer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('units')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitService) {}

  @ApiOperation({ summary: 'get units' })
  @Get()
  async findAll(
    @Query() query: QuerySearchDto,
  ): Promise<ResponseResult<UnitEntity>> {
    const units = await this.unitsService.findAll(query);
    return {
      items: units,
      totalCount: units.length,
    };
  }

  @ApiOperation({ summary: 'get detail unit' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UnitEntity> {
    const unit = await this.unitsService.findOne(id);
    return plainToInstance(UnitEntity, unit);
  }
}
