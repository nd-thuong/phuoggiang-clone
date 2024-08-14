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
import { UnitService } from '../units.service';
import { CreateUnitDto } from '../dto/create-unit.dto';
import { UpdateUnitDto } from '../dto/update-unit.dto';
import { JwtAuthenticationGuard } from '@/guards/jwt-authentication.guard';
import { RolesGuard } from '@/guards/role.guard';
import { ValidationBodyData } from '@/middleware/ValidationBodyData';
import { UnitEntity } from '../entities/unit.entity';
import { plainToInstance } from 'class-transformer';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('units')
@UseGuards(JwtAuthenticationGuard)
@Controller('units')
export class AdminUnitsController {
  constructor(private readonly unitsService: UnitService) {}

  @ApiOperation({ summary: 'create unit' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<CreateUnitDto>(CreateUnitDto))
  @Post()
  async create(@Body() createUnitDto: CreateUnitDto): Promise<UnitEntity> {
    const unit = await this.unitsService.create(createUnitDto);
    return plainToInstance(UnitEntity, unit);
  }

  @ApiOperation({ summary: 'update unit' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<UpdateUnitDto>(UpdateUnitDto))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<UnitEntity> {
    const unit = await this.unitsService.update(id, updateUnitDto);
    return plainToInstance(UnitEntity, unit);
  }

  @ApiOperation({ summary: 'remove unit' })
  @UseGuards(RolesGuard(['admin']))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.unitsService.remove(id);
  }
}
