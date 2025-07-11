import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { DataSource } from 'typeorm';

@Injectable()
export class MariaDbHealthIndicator {
  constructor(private readonly dataSource: DataSource) {}

  async check(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.dataSource.query('SELECT 1');
      return { [key]: { status: 'up' } };
    } catch (error) {
      return { [key]: { status: 'down', message: error.message } };
    }
  }
}
