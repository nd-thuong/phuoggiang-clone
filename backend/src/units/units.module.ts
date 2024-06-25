import { Module } from '@nestjs/common';
import { UnitService } from './units.service';
import { UnitsController } from './controller/units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitEntity } from './entities/unit.entity';
import { LoggerModule } from '@/logger/logger.module';
import { AdminUnitsController } from './controller/admin-units.controller';

@Module({
  controllers: [UnitsController, AdminUnitsController],
  providers: [UnitService],
  imports: [TypeOrmModule.forFeature([UnitEntity]), LoggerModule],
})
export class UnitsModule {}
