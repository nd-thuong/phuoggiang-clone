import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { SizesService } from '../sizes.service';
import { CreateSizeDto } from '../dto/create-size.dto';
import { UpdateSizeDto } from '../dto/update-size.dto';
import { JwtAuthenticationGuard } from '@/guards/jwt-authentication.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '@/logger/logger.service';
import { RolesGuard } from '@/guards/role.guard';
import { SizeEntity } from '../entities/size.entity';
import { plainToInstance } from 'class-transformer';
import { ValidationBodyData } from '@/middleware/ValidationBodyData';

@UseGuards(JwtAuthenticationGuard)
@Controller('sizes')
@ApiTags('sizes')
export class AdminSizesController {
  constructor(
    private readonly sizesService: SizesService,
    private readonly _logger: LoggerService,
  ) {}

  @ApiOperation({ summary: 'Create size' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<CreateSizeDto>(CreateSizeDto))
  @Post()
  async create(@Body() createSizeDto: CreateSizeDto): Promise<SizeEntity> {
    const size = await this.sizesService.create(createSizeDto);
    return plainToInstance(SizeEntity, size);
  }

  @ApiOperation({ summary: 'update size' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<UpdateSizeDto>(UpdateSizeDto))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSizeDto: UpdateSizeDto,
  ): Promise<SizeEntity> {
    const size = await this.sizesService.update(id, updateSizeDto);
    return plainToInstance(SizeEntity, size);
  }

  @ApiOperation({ summary: 'remove size' })
  @UseGuards(RolesGuard(['admin']))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    const kq = await this.sizesService.remove(id);
    return kq;
  }
}
