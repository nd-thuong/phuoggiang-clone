import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [TerminusModule, ScheduleModule.forRoot()],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
