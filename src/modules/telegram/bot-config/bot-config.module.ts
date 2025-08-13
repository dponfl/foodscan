import { Module } from '@nestjs/common';
import { BotConfigService } from './bot-config.service';
import { RedisModule } from '../../redis';

@Module({
  imports: [RedisModule],
  providers: [BotConfigService],
  exports: [BotConfigService],
})
export class BotConfigModule {}
