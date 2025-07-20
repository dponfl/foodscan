import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { RedisAdapter } from '@grammyjs/storage-redis';
import { RedisService } from '../redis';
import { ConfigService } from '@nestjs/config';
import {
  Bot,
  Context,
  session,
  type SessionFlavor,
  InputFile,
  InlineKeyboard,
} from 'grammy';
import { Menu } from '@grammyjs/menu';
import { hydrate, type HydrateFlavor } from '@grammyjs/hydrate';
import {
  Conversation,
  ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations';
import { ITelegramStarsPaymentPayload } from 'src/types';
import { UsersService } from '../users';
import { OpenAiService } from '../openai';
import * as path from 'path';
import { CommonHelpers } from '../../helpers/common';
import { TELEGRAM_BOT_MESSAGES } from './telegram.constants';
import {
  ConversationHome,
  ConversationOne,
  ConversationTwo,
} from './conversations';
import { ISessionData, MyContext } from '../../types';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: Bot<MyContext>;

  private readonly logger = new Logger(TelegramService.name, {
    timestamp: true,
  });

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly openAiService: OpenAiService,
    private readonly redisService: RedisService,
  ) {
    const tgToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!tgToken) {
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables!',
      );
    }
    this.bot = new Bot<MyContext>(tgToken);

    this.bot.use(session({ initial: () => ({}) }));

    const menuHome = ConversationHome.menu();

    const menuBackHome = ConversationHome.menuBackHome();

    this.bot.use(conversations());
    this.bot.use(
      createConversation(ConversationHome.conversation, ConversationHome.name),
    );
    this.bot.use(
      createConversation(ConversationOne.conversation, ConversationOne.name),
    );
    this.bot.use(
      createConversation(ConversationTwo.conversation, ConversationTwo.name),
    );

    this.bot.use(menuHome);
    this.bot.use(menuBackHome);

    this.bot.command('start', async (ctx) => {
      await ctx.reply('Welcome from the /start command!');
      await ctx.conversation.enter('home');
    });
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
    // this.bot.stop();
    this.logger.log('Telegram bot stopped successfully!');
  }
}
