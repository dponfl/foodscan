import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Bot } from 'grammy';
import { throwIfEmpty } from 'rxjs';
import { ITelegramStarsPaymentPayload } from 'src/types';
@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Bot;

  private readonly logger = new Logger(TelegramService.name, {
    timestamp: true,
  });

  private paymentData: ITelegramStarsPaymentPayload = {
    title: 'Product title',
    description: 'Product description',
    payload: '{}',
    currency: 'XXX',
    products: [],
  };

  constructor(private readonly configService: ConfigService) {
    const tgToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!tgToken) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables!',
      );
    }
    this.bot = new Bot(tgToken);

    this.setPaymentData({
      title: 'Test Product',
      description: 'Test description',
      payload: '{}',
      currency: 'XTR',
      products: [{ amount: 1, label: 'Test Product' }],
    });
  }

  async onModuleInit() {
    this.logger.log('Starting Telegram bot...');
    this.registerCommonHandlers();
    this.registerPaymentHandlers();
    this.registerTextHandler();

    try {
      this.logger.log('Attempting to start bot polling...');
      // Запускаем бота в режиме polling.
      this.bot.start();
      this.logger.log('Bot polling process has been initiated.');
    } catch (error) {
      this.logger.error('Failed to start Telegram bot polling!', error);
    }
  }

  async onModuleDestroy() {
    this.logger.log('Stopping Telegram bot...');
    this.bot.stop();
    this.logger.log('Telegram bot stopped successfully!');
  }

  private registerCommonHandlers() {
    this.bot.command('start', async (ctx) => {
      this.logger.debug(`User ${ctx.from?.id} started the bot`);
      // ctx.react('🤩');
      return ctx.reply('Добро пожаловать. Бот запущен и работает!');
    });
  }

  private registerPaymentHandlers() {
    this.bot.command('pay', async (ctx) => {
      this.logger.debug(`User ${ctx.from?.id} requested payment`);
      return ctx.replyWithInvoice(
        this.paymentData.title,
        this.paymentData.description,
        this.paymentData.payload,
        this.paymentData.currency,
        this.paymentData.products,
      );
    });

    this.bot.on('pre_checkout_query', (ctx) => {
      return ctx.answerPreCheckoutQuery(true).catch(() => {
        console.error('answerPreCheckoutQuery failed');
      });
    });
  }

  private registerTextHandler() {
    this.bot.on('message:text', async (ctx) => {
      this.logger.debug(`User ${ctx.from?.id} sent a message`);
      // ctx.react('👍');
      return ctx.reply(`Ты написал: "${ctx.message.text}"`);
    });
  }

  public setPaymentData(data: ITelegramStarsPaymentPayload) {
    this.paymentData = data;
  }
}
