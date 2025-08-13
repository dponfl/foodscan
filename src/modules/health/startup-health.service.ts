import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from './indicators/redis.health';
import { MariaDbHealthIndicator } from './indicators/mariadb.health';

@Injectable()
export class StartupHealthService implements OnApplicationBootstrap {
  private readonly logger = new Logger(StartupHealthService.name);

  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly mariadb: MariaDbHealthIndicator,
  ) {}

  /**
   * Этот метод будет автоматически вызван NestJS после полного запуска приложения.
   */
  async onApplicationBootstrap() {
    this.logger.log(
      'Performing initial health check on application startup...',
    );

    try {
      // Выполняем те же проверки, что и в контроллере
      await this.health.check([
        () => this.http.pingCheck('google', 'https://www.google.com'),
        () => this.redis.check('redis'),
        () => this.mariadb.check('mariadb'),
      ]);

      // Если мы дошли до сюда, значит, все проверки прошли успешно
      this.logger.log(
        'Health check successful. All services are running correctly.',
      );
    } catch (error) {
      // Если хотя бы одна проверка не удалась, Terminus выбросит ошибку
      this.logger.error('Startup health check failed!');
      // Логируем детальный отчет об ошибке, который Terminus формирует автоматически
      this.logger.error(error.getResponse());
    }
  }
}
