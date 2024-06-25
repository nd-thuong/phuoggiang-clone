import { Module } from '@nestjs/common';
import { SurfaceService } from './surface.service';
import { SurfaceController } from './controller/surface.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurfaceEntity } from './entities/surface.entity';
import { AdminSurfaceController } from './controller/admin-surface.controller';

@Module({
  controllers: [SurfaceController, AdminSurfaceController],
  providers: [SurfaceService],
  imports: [TypeOrmModule.forFeature([SurfaceEntity])],
})
export class SurfaceModule {}
