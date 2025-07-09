import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { RedisModule } from '../redis/redis.module';
import { RedisHealthIndicator } from './indicators/redis.health';
import { StartupHealthService } from './startup-health.service';

@Module({
  imports: [TerminusModule, HttpModule, RedisModule],
  controllers: [HealthController],
  providers: [RedisHealthIndicator, StartupHealthService],
})
export class HealthModule {}
