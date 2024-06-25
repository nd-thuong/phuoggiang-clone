import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  public constructor(
    private _healthCheckService: HealthCheckService,
    private _typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private _memoryHealthIndicator: MemoryHealthIndicator,
    private _diskHealthIndicator: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  public check() {
    return this._healthCheckService.check([
      () =>
        this._typeOrmHealthIndicator.pingCheck('database', {
          timeout: 1000,
        }),
      // the process should not use more than 300MB memory
      () =>
        this._memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
      // The process should not have more than 300MB RSS memory allocated
      () =>
        this._memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
      // the used disk storage should not exceed the 50% of the available space
      () =>
        this._diskHealthIndicator.checkStorage('disk health', {
          thresholdPercent: 0.9,
          path: __dirname,
        }),
    ]);
  }
}
