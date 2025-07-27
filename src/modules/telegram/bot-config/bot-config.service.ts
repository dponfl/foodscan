import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../redis';

import { Bot, session } from 'grammy';
import { ISessionData, MyContext } from '../../../types';
import { RedisAdapter } from '@grammyjs/storage-redis';

@Injectable()
export class BotConfigService {
  private bot: Bot<MyContext>;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    const tgToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!tgToken) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables!',
      );
    }
    this.bot = new Bot<MyContext>(tgToken);

    // --- НАЧАЛО БЛОКА НАСТРОЙКИ MIDDLEWARE ---

    // 1. Настраиваем хранилище сессий в Redis
    const redisClient = this.redisService.getRedisClient();

    const storage = new RedisAdapter({ instance: redisClient });

    // 2. Устанавливаем middleware для сессий, используя Redis
    this.bot.use(
      session({
        initial: (): ISessionData => ({
          currentScene: '',
        }),
        storage,
      }),
    );

    // --- КОНЕЦ БЛОКА НАСТРОЙКИ MIDDLEWARE ---
  }

  getBot(): Bot<MyContext> {
    return this.bot;
  }
}
