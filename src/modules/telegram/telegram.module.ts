import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { UsersModule } from '../users';
import { OpenAiModule } from '../openai';
import { RedisModule } from '../redis';

@Module({
  imports: [UsersModule, OpenAiModule, RedisModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
