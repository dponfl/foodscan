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
  SessionFlavor,
  InputFile,
  InlineKeyboard,
} from 'grammy';
import { Menu } from '@grammyjs/menu';
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
// import { TELEGRAM_BOT_MESSAGES } from './telegram.constants';

// Определяем кастомный контекст с поддержкой сессий и конверсаций
interface SessionData {
  photo?: any; // Для хранения фото
}
type MyContext = ConversationFlavor<Context & SessionFlavor<SessionData>>;
type MyConversation = Conversation<MyContext>;
@Injectable()
export class TelegramServiceOld implements OnModuleInit, OnModuleDestroy {
  private bot: Bot<MyContext>;

  private readonly logger = new Logger(TelegramServiceOld.name, {
    timestamp: true,
  });

  private paymentData: ITelegramStarsPaymentPayload = {
    title: 'Product title',
    description: 'Product description',
    payload: '{}',
    currency: 'XXX',
    products: [],
  };

  private readonly mainMenuText =
    'Ты вернулся в главное меню. Что будем делать?\n\n' +
    'Выбирай нужный пункт ниже и продолжим 👇';

  private readonly homeKeyboard = new InlineKeyboard()
    .text('TELEGRAM_BOT_MESSAGES.homeKeyboard.go_check', 'go_check')
    .row()
    .text('TELEGRAM_BOT_MESSAGES.homeKeyboard.go_pricing', 'go_pricing')
    .row()
    .text('TELEGRAM_BOT_MESSAGES.homeKeyboard.go_profile', 'go_profile')
    .text('TELEGRAM_BOT_MESSAGES.homeKeyboard.go_help', 'go_help');

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

    // --- НАЧАЛО БЛОКА НАСТРОЙКИ MIDDLEWARE ---

    // 1. Настраиваем хранилище сессий в Redis
    const redisClient = this.redisService.getRedisClient();

    const storage = new RedisAdapter({ instance: redisClient });

    // 2. Устанавливаем middleware для сессий, используя Redis
    this.bot.use(session({ initial: (): SessionData => ({}), storage }));

    // 3. Устанавливаем middleware для диалога
    this.bot.use(conversations());

    // 4. Регистрируем наш диалог
    this.bot.use(
      createConversation(
        this.analyzeProductConversation.bind(this),
        'analyzeProductConversation',
      ),
    );

    // --- КОНЕЦ БЛОКА НАСТРОЙКИ MIDDLEWARE ---

    this.setPaymentData({
      title: 'Test Product',
      description: 'Test description',
      payload: '{}',
      currency: 'XTR',
      products: [{ amount: 1, label: 'Test Product' }],
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

  private registerHandlers() {
    this.registerCommonHandlers();
    this.registerPaymentHandlers();
  }

  private async handleStartCommand(ctx: MyContext) {
    try {
      const user = ctx.from;
      if (user) {
        await this.usersService.findOrCreate({
          clientId: user.id, // user.id является типом number
          userName: user.first_name, // Поле в entity: userName
          userNick: user.username, // Поле в entity: userNick
          lang: user.language_code || 'ru', // Поле в entity: lang
        });
      }
    } catch (error) {
      this.logger.error(
        `Failed to process user in DB for clientId ${ctx.from?.id}`,
        error,
      );
    }

    await ctx.reply('TELEGRAM_BOT_MESSAGES.introText', {
      parse_mode: 'Markdown',
      reply_markup: this.homeKeyboard,
    });
  }

  private async handleHomeCommand(ctx: MyContext) {
    await ctx.reply(this.mainMenuText, {
      reply_markup: this.homeKeyboard,
    });
  }

  private async handleCheckScenario(ctx: MyContext) {
    await ctx.conversation.enter('analyzeProductConversation');
  }

  private async handlePricingScenario(ctx: MyContext) {
    await ctx.reply('Запускаем сценарий просмотра тарифов...');
  }

  private async handleProfileScenario(ctx: MyContext) {
    await ctx.reply('Запускаем сценарий просмотра статистики...');
  }

  private async handleHelpScenario(ctx: MyContext) {
    await ctx.reply('Запускаем сценарий поддержки...');
  }

  /**
   * Логика сценария "Analyze The Product" в виде диалога.
   */
  private async analyzeProductConversation(
    conversation: MyConversation,
    ctx: MyContext,
  ) {
    const backKeyboard = new InlineKeyboard().text('⬅️ Назад', 'go_home');

    const photoPath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'example-composition.jpg',
    );

    // 1. Отправляем инструкции один раз в самом начале
    const instructionsPart1 = `📸 Пришли мне ОДНО фото продукта — с обратной стороны упаковки — там, где указан состав (список ингредиентов мелким шрифтом).


⚠️ Важно: пока только одно фото! Дальше я сам всё подскажу.

🧠 Пример, как должно выглядеть фото:`;
    const instructionsPart2 =
      'Когда будешь готов — просто пришли фото сюда, и я начну анализ.';

    await ctx.reply(instructionsPart1);
    await ctx.replyWithPhoto(new InputFile(photoPath), {
      caption: instructionsPart2,
      reply_markup: backKeyboard,
    });

    // 2. Запускаем цикл, давая пользователю до 3-х попыток
    // for (let i = 0; i < 3; i++) {
    //   // На каждой итерации заново "устраиваем гонку"
    //   const messageCtx = await Promise.race([
    //     conversation.waitFor('message'), // Промис 1: Ждём любого сообщения, waitFor вернёт нам "внутренний" контекст без сессии.
    //     conversation.waitFor('callback_query:data'),
    //     CommonHelpers.sleep(300000), // Промис 2: Ждём 5 минут
    //   ]);

    //   // 3. Проверяем, победил ли тайм-аут
    //   if (messageCtx === undefined) {
    //     await ctx.reply(
    //       'Время ожидания вышло. Вы были возвращены в главное меню.',
    //     );
    //     await conversation.external(() => this.handleHomeCommand(ctx));
    //     return; // Полностью выходим из диалога
    //   } else if (messageCtx.callbackQuery?.data === 'go_home') {
    //     // ЛОГИКА НАЖАТИЯ КНОПКИ "НАЗАД"
    //     await messageCtx.answerCallbackQuery();
    //     await conversation.external(() => this.handleHomeCommand(ctx));
    //     return;
    //   }

    //   // 4. Если мы здесь, значит, пришло сообщение. Проверяем его тип.

    //   if (messageCtx.message && messageCtx.message.photo) {
    //     // СЛУЧАЙ УСПЕХА: Пользователь прислал фото. Используем conversation.external() для ЗАПИСИ в сессию.

    //     await conversation.external(async (externalCtx) => {
    //       externalCtx.session.photo = messageCtx.message.photo;
    //     });

    //     // await messageCtx.reactions('👍');

    //     await messageCtx.reply(
    //       'Отлично! Я анализирую состав продукта, это может занять некоторое время...',
    //     );

    //     await messageCtx.replyWithChatAction('typing');

    //     const analysisResult =
    //       await this.openAiService.analyzeProductComposition(
    //         messageCtx.message.photo,
    //       );

    //     if (analysisResult.status === 'Success' && analysisResult.payload) {
    //       const successMessage =
    //         '🔎 Разбор состава:\n' +
    //         `${analysisResult.payload}\n\n` +
    //         '❤️ Заботься о себе — ты то, что ты ешь!';
    //       await messageCtx.reply(successMessage, { parse_mode: 'Markdown' });
    //     } else {
    //       await messageCtx.reply(
    //         'Произошла ошибка при анализе. Пожалуйста, попробуйте позже.',
    //       );
    //     }

    //     await conversation.external(() => this.handleHomeCommand(ctx));
    //     return; // Успешно завершаем и выходим из диалога
    //   } else {
    //     // СЛУЧАЙ ОШИБКИ ВВОДА: Пользователь прислал что-то другое

    //     const errorMessage =
    //       '❗ Кажется, это не фото упаковки.\n' +
    //       'Чтобы я смог провести анализ, мне нужен состава продукта (фото списка ингредиентов и т.д.).\n\n' +
    //       '🔁 Пожалуйста, отправь мне фото состава — и я сразу начну проверку!';

    //     await messageCtx.reply(errorMessage, { reply_markup: backKeyboard });
    //   }
    // }

    // 5. Этот код выполнится, если все 3 попытки были неудачными
    await ctx.reply(
      'К сожалению, так и не удалось получить фото. Вы были возвращены в главное меню.',
    );
    await conversation.external(() => this.handleHomeCommand(ctx));
  }

  async onModuleInit() {
    this.logger.log('Starting Telegram bot...');
    this.registerHandlers();
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
    this.bot.stop();
    this.logger.log('Telegram bot stopped successfully!');
  }

  private registerCommonHandlers() {
    this.bot.command('start', (ctx) => this.handleStartCommand(ctx));
    this.bot.command('home', (ctx) => this.handleHomeCommand(ctx));
    this.bot.command(
      'check',
      async (ctx) => await this.handleCheckScenario(ctx),
    );
    this.bot.command('pricing', (ctx) => this.handlePricingScenario(ctx));
    this.bot.command('profile', (ctx) => this.handleProfileScenario(ctx));
    this.bot.command('help', (ctx) => this.handleHelpScenario(ctx));

    this.bot.callbackQuery('go_home', (ctx) => this.handleHomeCommand(ctx));
    this.bot.callbackQuery('go_check', (ctx) => this.handleCheckScenario(ctx));
    this.bot.callbackQuery('go_pricing', (ctx) =>
      this.handlePricingScenario(ctx),
    );
    this.bot.callbackQuery('go_profile', (ctx) =>
      this.handleProfileScenario(ctx),
    );
    this.bot.callbackQuery('go_help', (ctx) => this.handleHelpScenario(ctx));
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

  public setPaymentData(data: ITelegramStarsPaymentPayload) {
    this.paymentData = data;
  }
}
