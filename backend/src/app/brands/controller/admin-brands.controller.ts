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
import { BrandService } from '../brands.service';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '@/guards/jwt-authentication.guard';
import { RolesGuard } from '@/guards/role.guard';
import { ValidationBodyData } from '@/middleware/ValidationBodyData';
import { BrandEntity } from '../entities/brand.entity';
import { plainToInstance } from 'class-transformer';

@ApiTags('brands')
@UseGuards(JwtAuthenticationGuard)
@Controller('brands')
export class AdminBrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({ summary: 'Create brand' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<CreateBrandDto>(CreateBrandDto))
  @Post()
  async create(@Body() createBrandDto: CreateBrandDto): Promise<BrandEntity> {
    const brand = await this.brandService.create(createBrandDto);
    return plainToInstance(BrandEntity, brand);
  }

  @ApiOperation({ summary: 'update brand' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<UpdateBrandDto>(UpdateBrandDto))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<BrandEntity> {
    const brand = await this.brandService.update(id, updateBrandDto);
    return plainToInstance(BrandEntity, brand);
  }

  @ApiOperation({ summary: 'remove brand' })
  @UseGuards(RolesGuard(['admin']))
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<boolean> {
    return await this.brandService.remove(id);
  }
}
