import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { Bot } from 'grammy';
import { MyContext } from '../../types';
import { ScenesOrchestratorService } from './scenes/scenes-orchestrator.service';
import { BotConfigService } from './bot-config/bot-config.service';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Bot<MyContext>;

  private readonly logger = new Logger(TelegramService.name, {
    timestamp: true,
  });

  constructor(
    private readonly botConfigService: BotConfigService,
    // Оркестратор внедряется, чтобы NestJS его создал и запустил
    private readonly scenesOrchestratorService: ScenesOrchestratorService,
  ) {
    this.bot = botConfigService.getBot();
  }

  private registerErrorHandler() {
    this.bot.catch((err) => {
      const ctx = err.ctx;
      const error = err.error;

      this.logger.error(
        `Error while handling update ${ctx.update.update_id}:`,
        error,
      );

      // Отправляем пользователю сообщение о том, что что-то пошло не так
      // Это необязательно, но является хорошей практикой
      const errorMessage =
        'Произошла непредвиденная ошибка. Мы уже работаем над её устранением. Пожалуйста, попробуйте позже.';

      // Проверяем, можем ли мы ответить в этом контексте
      if (ctx.chat?.id) {
        ctx.api.sendMessage(ctx.chat.id, errorMessage).catch((e) => {
          this.logger.error('Failed to send error message to user:', e);
        });
      }
    });
  }

  async onModuleInit() {
    this.logger.log('Starting Telegram bot...');
    this.registerErrorHandler();

    this.logger.log('Attempting to start bot polling...');
    // Запускаем бота в режиме polling.
    this.bot.start();
    this.logger.log('Bot polling process has been initiated.');
  }

  async onModuleDestroy() {
    this.logger.log('Stopping Telegram bot...');
    this.bot.stop();
    this.logger.log('Telegram bot stopped successfully!');
  }
}
