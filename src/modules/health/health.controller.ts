import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './indicators/redis.health';
import { MariaDbHealthIndicator } from './indicators/mariadb.health';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly mariadb: MariaDbHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('google', 'https://www.google.com'), // Проверяем внешний интернет
      () => this.redis.check('redis'), // Проверяем наш Redis
      () => this.mariadb.check('mariadb'), // Проверяем нашу MariaDB
    ]);
  }
}
