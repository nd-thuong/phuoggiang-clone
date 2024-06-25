import { Injectable, Logger } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class HealthService {
  private readonly _logger = new Logger(HealthService.name);

  public constructor(
    private _healthCheckService: HealthCheckService,
    private _typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private _diskHealthIndicator: DiskHealthIndicator,
    private _memoryHealthIndicator: MemoryHealthIndicator,
  ) {}

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // public checkLogger() {
  //   this._logger.debug('Everything is ok!');
  // }

  // @Cron(CronExpression.EVERY_30_MINUTES)
  // checkMicroserviceTypeorm() {
  //   return this.healthCheckService.check([
  //     () =>
  //       this.typeOrmHealthIndicator.pingCheck('microservice', {
  //         timeout: 1000,
  //       }),
  //   ]);
  // }

  // @Cron(CronExpression.EVERY_30_MINUTES)
  // checkDisk() {
  //   return this.healthCheckService.check([
  //     () =>
  //       this.diskHealthIndicator.checkStorage('microservice', {
  //         thresholdPercent: 0.9,
  //         path: 'C:\\',
  //       }),
  //   ]);
  // }

  // @Cron(CronExpression.EVERY_30_MINUTES)
  // checkMemory() {
  //   return this.healthCheckService.check([
  //     // the process should not use more than 300MB memory
  //     () => this.memoryHealthIndicator.checkHeap('memory_heap', 300 * 1024 * 1024),
  //     // The process should not have more than 300MB RSS memory allocated
  //     () => this.memoryHealthIndicator.checkRSS('memory_rss', 300 * 1024 * 1024),
  //   ]);
  // }
}
