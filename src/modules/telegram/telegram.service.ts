import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Bot;
  private readonly logger = new Logger(TelegramService.name, {
    timestamp: true,
  });

  constructor(private readonly configService: ConfigService) {
    const tgToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!tgToken) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables!',
      );
    }
    this.bot = new Bot(tgToken);
  }

  async onModuleInit() {
    this.logger.log('Starting Telegram bot...');
    this.registerHandlers();
    // Запускаем бота в режиме polling.
    // В продакшене лучше использовать вебхуки.
    this.bot.start();
    this.logger.log('Telegram bot started successfully!');
  }

  async onModuleDestroy() {
    this.logger.log('Stopping Telegram bot...');
    this.bot.stop();
    this.logger.log('Telegram bot stopped successfully!');
  }

  private registerHandlers() {
    // Регистрируем обработчики
    this.bot.command('start', async (ctx) => {
      this.logger.debug(`User ${ctx.from?.id} started the bot`);
      ctx.react('🤩');
      return ctx.reply('Добро пожаловать. Бот запущен и работает!');
    });

    this.bot.on('message:text', async (ctx) => {
      this.logger.debug(`User ${ctx.from?.id} sent a message`);
      if (ctx.message.text) {
        ctx.react('👍');
        return ctx.reply(`Ты написал: ${ctx.message.text}`);
      }
    });
  }
}
