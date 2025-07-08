import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { RedisService } from '../../redis/index';

@Injectable()
export class RedisHealthIndicator {
  constructor(private readonly redisService: RedisService) {}

  /**
   * Checks if the Redis connection is healthy.
   * @param key The key that will be used for the health indicator result.
   */
  async check(key: string): Promise<HealthIndicatorResult> {
    try {
      // We use the PING command to ensure the connection is live.
      await this.redisService.getRedisClient().ping();
      // If the command succeeds, return an 'up' status.
      return { [key]: { status: 'up' } };
    } catch (error) {
      // If the command fails, return a 'down' status with the error message.
      return { [key]: { status: 'down', message: error.message } };
    }
  }
}
