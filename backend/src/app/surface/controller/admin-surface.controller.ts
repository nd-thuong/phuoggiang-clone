import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SurfaceService } from '../surface.service';
import { CreateSurfaceDto } from '../dto/create-surface.dto';
import { UpdateSurfaceDto } from '../dto/update-surface.dto';
import { JwtAuthenticationGuard } from '@/guards/jwt-authentication.guard';
import { RolesGuard } from '@/guards/role.guard';
import { ValidationBodyData } from '@/middleware/ValidationBodyData';
import { SurfaceEntity } from '../entities/surface.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('surfaces')
@UseGuards(JwtAuthenticationGuard)
@Controller('surfaces')
export class AdminSurfaceController {
  constructor(private readonly surfaceService: SurfaceService) {}

  @ApiOperation({ summary: 'create surface' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<CreateSurfaceDto>(CreateSurfaceDto))
  @Post()
  async create(
    @Body() createSurfaceDto: CreateSurfaceDto,
  ): Promise<SurfaceEntity> {
    return this.surfaceService.create(createSurfaceDto);
  }

  @ApiOperation({ summary: 'update surface' })
  @UseGuards(RolesGuard(['admin']))
  @UseInterceptors(new ValidationBodyData<UpdateSurfaceDto>(UpdateSurfaceDto))
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSurfaceDto: UpdateSurfaceDto,
  ): Promise<SurfaceEntity> {
    return this.surfaceService.update(id, updateSurfaceDto);
  }

  @ApiOperation({ summary: 'remove surface' })
  @UseGuards(RolesGuard(['admin']))
  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.surfaceService.remove(id);
  }
}
