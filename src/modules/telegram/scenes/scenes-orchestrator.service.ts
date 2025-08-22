import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../../redis';
import { Bot, InlineKeyboard } from 'grammy';
import { MyContext } from '../../../types';
import { BotConfigService } from '../bot-config/bot-config.service';
import { StartSceneService } from './start/start.service';
import { MainMenuSceneService } from './main-menu/main-menu.service';
import { CheckProductSceneService } from './check-product/check-product.service';
import { SupportSceneService } from './support/support.service';
import {
  CALLBACK_DATA,
  PAYMENT_OPTIONS,
  SCENES,
  TIMEOUTS,
  WAITING_FOR_INPUT,
} from './scenes.constants';
import { OpenAiService } from '../../../modules/openai';
import { TariffsSceneService } from './tariffs/tariffs.service';
import { PaymentSceneService } from './payment/payment.service';
import { PaymentProvider } from './payment/payment';
import { ProfileSceneService } from './profile/profile.service';
import { PaymentsService } from '../../payments';

@Injectable()
export class ScenesOrchestratorService {
  private readonly bot: Bot<MyContext>;
  private readonly logger = new Logger(ScenesOrchestratorService.name);
  private redisClient;

  private readonly backKeyboard = new InlineKeyboard().text(
    '🔙 Назад',
    CALLBACK_DATA.GO_TO_MAIN_MENU,
  );

  constructor(
    private readonly botConfigService: BotConfigService,
    private readonly redisService: RedisService,
    private readonly startScene: StartSceneService,
    private readonly mainMenuScene: MainMenuSceneService,
    private readonly checkProductScene: CheckProductSceneService,
    private readonly tariffsScene: TariffsSceneService,
    private readonly paymentScene: PaymentSceneService,
    private readonly paymentProvider: PaymentProvider,
    private readonly profileScene: ProfileSceneService,
    private readonly supportScene: SupportSceneService,
    private readonly openAiService: OpenAiService,
    private readonly paymentsService: PaymentsService,
  ) {
    this.redisClient = this.redisService.getRedisClient();

    this.bot = botConfigService.getBot();
    this.registerHandlers();
  }

  private registerHandlers() {
    /**
     * Обработка команд
     */

    this.bot.command('start', async (ctx) => {
      this.logger.log(`Processing /start command for user ${ctx?.from?.id}`);
      ctx.session.currentScene = SCENES.START;
      await this.startScene.handle(ctx);

      // Сразу после старта переводим в главное меню (с задержкой TIMEOUTS.AFTER_START (3 секунды) для визуального эффекта и концентрации внимания пользователя на тексте сообщения /start)

      await ctx.replyWithChatAction('typing');

      setTimeout(
        async () => await this.goToScene(ctx, SCENES.MAIN_MENU),
        TIMEOUTS.AFTER_START,
      );
    });

    this.bot.command('check', async (ctx) => {
      this.logger.log(`Processing /check command for user ${ctx?.from?.id}`);
      ctx.session.currentScene = SCENES.CHECK_PRODUCT;
      await this.checkProductScene.handle(ctx);
    });

    this.bot.command('pricing', async (ctx) => {
      this.logger.log(`Processing /pricing command for user ${ctx?.from?.id}`);
      ctx.session.currentScene = SCENES.TARIFFS;
      await this.tariffsScene.handle(ctx);
    });

    this.bot.command('buy', async (ctx) => {
      this.logger.log(`Processing /buy command for user ${ctx?.from?.id}`);
      ctx.session.currentScene = SCENES.PAYMENT;
      await this.paymentScene.handle(ctx);
    });

    this.bot.command('profile', async (ctx) => {
      this.logger.log(`Processing /profile command for user ${ctx?.from?.id}`);
      ctx.session.currentScene = SCENES.SUPPORT;
      await this.profileScene.handle(ctx);
    });

    this.bot.command('help', async (ctx) => {
      this.logger.log(`Processing /help command for user ${ctx?.from?.id}`);
      ctx.session.currentScene = SCENES.SUPPORT;
      await this.supportScene.handle(ctx);
    });

    // Обработка процесса платежа, произведенного в Telegram Stars

    this.bot.on('pre_checkout_query', async (ctx) => {
      return ctx.answerPreCheckoutQuery(true).catch(() => {
        this.logger.error(
          `answerPreCheckoutQuery failed for clientId: ${ctx.from?.id}`,
        );
      });
    });

    // ЕДИНЫЙ обработчик для всех нажатий кнопок
    this.bot.on('callback_query:data', async (ctx) => {
      const callbackData = ctx.callbackQuery.data;
      this.logger.log(`Processing callback: ${callbackData}`);

      switch (callbackData) {
        case CALLBACK_DATA.GO_TO_MAIN_MENU:
          await this.goToScene(ctx, SCENES.MAIN_MENU);
          break;
        case CALLBACK_DATA.GO_TO_CHECK_PRODUCT:
          // TODO: Добавить проверку наличия бесплатных проверок или подписки. При необходимости - сообщение пользователю и перевод в сцену Tariffs

          await this.goToScene(ctx, SCENES.CHECK_PRODUCT);
          break;
        case CALLBACK_DATA.GO_TO_TARIFFS:
          await this.goToScene(ctx, SCENES.TARIFFS);
          break;
        case CALLBACK_DATA.GO_TO_PAYMENT:
          await this.goToScene(ctx, SCENES.PAYMENT);
          break;
        case CALLBACK_DATA.GO_TO_PAYMENT_OPTION_ONE:
          await this.paymentProvider.generatePaymentInvoce(
            ctx,
            PAYMENT_OPTIONS.ONE_TIME,
          );
          break;
        case CALLBACK_DATA.GO_TO_PAYMENT_OPTION_TWO:
          await this.paymentProvider.generatePaymentInvoce(
            ctx,
            PAYMENT_OPTIONS.TEN_TIMES,
          );
          break;
        case CALLBACK_DATA.GO_TO_PAYMENT_OPTION_THREE:
          await this.paymentProvider.generatePaymentInvoce(
            ctx,
            PAYMENT_OPTIONS.MONTH,
          );
          break;
        case CALLBACK_DATA.GO_TO_PAYMENT_OPTION_FOUR:
          await this.paymentProvider.generatePaymentInvoce(
            ctx,
            PAYMENT_OPTIONS.YEAR,
          );
          break;
        case CALLBACK_DATA.GO_TO_PROFILE:
          await this.goToScene(ctx, SCENES.PROFILE, true, true);
          break;
        case CALLBACK_DATA.GO_TO_SUPPORT:
          await this.goToScene(ctx, SCENES.SUPPORT);
          break;
        default:
          this.logger.warn(
            `Unknown callback data: ${callbackData} for chatId: ${ctx?.from?.id}`,
          );
          await ctx.answerCallbackQuery();
      }
    });

    /**
     * Обработка сообщений
     */

    this.bot.on('message:successful_payment', async (ctx) => {
      if (!ctx.message || !ctx.message.successful_payment || !ctx.from) {
        return;
      }

      // TODO: Обработать успешную оплату, увеличить в БД кол-во доступных проверок или срок подписки, сохранить в БД запись об оплате (включая детали платежа) и перевести пользователя в главное меню

      this.logger.log(
        `Successful payment for clientId ${ctx.from.id}: ${JSON.stringify(
          ctx.message.successful_payment,
        )}`,
      );

      await this.paymentsService.createPaidRecord({
        clientId: ctx.from.id,
        successfulPayment: ctx.message.successful_payment,
      });

      await ctx.reply(
        '⭐ Оплата <b>прошла успешно</b> — благодарим за покупку\\!',
        {
          parse_mode: 'HTML',
        },
      );

      await this.goToScene(ctx, SCENES.MAIN_MENU, false, false);
    });

    this.bot.on('message:photo', async (ctx) => {
      const waitingFor = ctx.session.waitingForInput;
      const photo = ctx.message.photo;

      // Если бот ничего не ожидает от пользователя, выходим
      if (!waitingFor) return;

      switch (waitingFor) {
        case WAITING_FOR_INPUT.PRODUCT_PHOTO: {
          await this.handleProductPhoto(ctx, photo);
          break;
        }

        default: {
          // На случай, если состояние есть, но обработчик для него не найден
          this.logger.warn(
            `Unhandled waitingFor state: ${waitingFor} from user ${ctx.from.id}`,
          );
          break;
        }
      }
    });

    this.bot.on('message', async (ctx) => {
      const waitingFor = ctx.session.waitingForInput;
      // Если бот ничего не ожидает от пользователя, выходим
      if (!waitingFor) return;

      switch (waitingFor) {
        case WAITING_FOR_INPUT.PRODUCT_PHOTO: {
          await ctx.reply(
            `❗ Кажется, это не фото упаковки. Чтобы я смог провести анализ, мне нужен состава продукта (фото списка ингредиентов и т.д.).
🔁 Пожалуйста, отправь мне фото состава — и я сразу начну проверку!
`,
            { reply_markup: this.backKeyboard, parse_mode: 'HTML' },
          );
          break;
        }
        default: {
          // На случай, если состояние есть, но обработчик для него не найден
          this.logger.warn(
            `Unhandled waitingFor state: ${waitingFor} from user ${ctx.from.id}`,
          );
          break;
        }
      }
    });
  }

  private async handleProductPhoto(ctx: MyContext, photo: any) {
    this.logger.log(
      `Received photo from ${ctx?.from?.id}, photo[0].file_id: ${photo[0].file_id}\n\nphoto: ${JSON.stringify(
        photo,
      )}`,
    );

    ctx.session.photo = photo;

    // Логика обработки фотографии

    await ctx.reply(
      `Отлично! Я анализирую состав продукта, это может занять некоторое время…`,
    );

    await ctx.replyWithChatAction('typing');

    const analysisResult = await this.openAiService.analyzeProductImage(photo);

    if (analysisResult.status === 'Success' && analysisResult.payload) {
      if (Array.isArray(analysisResult.payload.messageChunks)) {
        // TODO: Уменьшить в БД кол-во доступных проверок

        for (const msg of analysisResult.payload.messageChunks) {
          await ctx.reply(msg, { parse_mode: 'HTML' });
        }

        // Очищаем состояние ожидания и возвращаем в главное меню
        ctx.session.waitingForInput = null;
        ctx.session.sceneEntryTime = null;
        await this.mainMenuScene.handle(ctx);
      } else {
        this.logger.error(
          `Error - analysisResult.payload.messageChunks is not an array: ${JSON.stringify(analysisResult.payload.messageChunks)}`,
        );
        await ctx.reply(
          'Произошла ошибка при анализе. Пожалуйста, попробуйте позже.',
        );

        // Очищаем состояние ожидания и возвращаем в главное меню
        ctx.session.waitingForInput = null;
        ctx.session.sceneEntryTime = null;
        await this.mainMenuScene.handle(ctx);
      }
    } else if (analysisResult.status === 'Failed') {
      // Это кейс, когда была отправлена фотография, но она не соответствовала требованиям и на ней нет состава продукта
      if (
        !analysisResult.payload.isContextCorrect &&
        analysisResult.payload.contextExplanation
      ) {
        // TODO: Уменьшить в БД кол-во доступных проверок

        await ctx.reply(
          `Ты прислал фото, на котором отсутствует состав продукта:\n❗️ ${analysisResult.payload.contextExplanation}\n\nПожалуйста, отправь мне фото состава продукта, чтобы я смог провести анализ!`,
          { reply_markup: this.backKeyboard },
        );
      } else {
        this.logger.error(
          `analysisResult.payload.isContextCorrect and/or analysisResult.payload.contextExplanation are not correct: ${JSON.stringify(analysisResult.payload)}`,
        );
        await ctx.reply(
          'Произошла ошибка при анализе. Пожалуйста, попробуйте позже.',
        );

        // Очищаем состояние ожидания и возвращаем в главное меню
        ctx.session.waitingForInput = null;
        ctx.session.sceneEntryTime = null;
        await this.mainMenuScene.handle(ctx);
      }
    }
  }

  // Вспомогательный метод для смены сцен
  private async goToScene(
    ctx: MyContext,
    sceneName: string,
    deleteKeyboard: boolean = true,
    deleteMessage: boolean = false,
  ) {
    ctx.session.currentScene = sceneName;
    switch (sceneName) {
      case SCENES.MAIN_MENU:
        await this.mainMenuScene.handle(ctx, deleteKeyboard, deleteMessage);
        break;
      case SCENES.CHECK_PRODUCT:
        await this.checkProductScene.handle(ctx);
        break;
      case SCENES.TARIFFS:
        await this.tariffsScene.handle(ctx);
        break;
      case SCENES.PAYMENT:
        await this.paymentScene.handle(ctx);
        break;
      case SCENES.PROFILE:
        await this.profileScene.handle(ctx);
        break;
      case SCENES.SUPPORT:
        await this.supportScene.handle(ctx);
        break;
    }
  }

  // МЕТОД ДЛЯ ПРОВЕРКИ ТАЙМ-АУТОВ
  @Cron(CronExpression.EVERY_MINUTE) // Запускать каждую минуту
  async handleTimeouts() {
    this.logger.log('Running timeout check...');

    // Используем SCAN для безопасного получения ключей
    const stream = this.redisClient.scanStream({
      match: '[0-9]*', // Ищем ключи, состоящие только из цифр
      count: 100, // Обрабатывать по 100 ключей за раз
    });

    let sessionKeys: string[] = [];
    stream.on('data', (keys: string[]) => {
      // keys - это порция найденных ключей
      sessionKeys = sessionKeys.concat(keys);
    });

    // Ждём, пока сканирование не будет завершено
    await new Promise<void>((resolve) => {
      stream.on('end', () => resolve());
    });

    this.logger.log(`Found ${sessionKeys.length} sessions via SCAN.`);
    this.logger.debug(`Session keys: ${sessionKeys}`);

    for (const chatId of sessionKeys) {
      const sessionJson = await this.redisClient.get(chatId);
      if (!sessionJson) continue;

      const session = JSON.parse(sessionJson);

      // Проверяем, есть ли в сессии состояние ожидания и метка времени
      if (session.waitingForInput && session.sceneEntryTime) {
        this.logger.log(
          `Session ${chatId} has waitingForInput and sceneEntryTime, checking timeout...`,
        );
        // Рассчитываем разницу времени
        const timeDiff = Date.now() - session.sceneEntryTime;
        this.logger.log(
          `Timeout is: ${TIMEOUTS.DEFAULT} ms. Time difference: ${timeDiff} ms`,
        );

        // Проверяем, превышено ли время ожидания

        if (Date.now() - session.sceneEntryTime > TIMEOUTS.DEFAULT) {
          this.logger.log(
            `Session with Chat ID: ${chatId} timed out. Resetting...`,
          );

          // 1. Отправляем сообщение о тайм-ауте
          await this.bot.api.sendMessage(
            chatId,
            'Время ожидания истекло. Вы были возвращены в главное меню.',
          );

          // 2. Получаем контент из сервиса mainMenuScene
          const { text, keyboard } = this.mainMenuScene.getMainMenuPayload();

          // 3. Отправляем сообщение главного меню
          await this.bot.api.sendMessage(chatId, text, {
            reply_markup: keyboard,
          });

          // 4. Очищаем состояние и возвращаем в главное меню (логически)
          session.waitingForInput = null;
          session.sceneEntryTime = null;
          session.currentScene = SCENES.MAIN_MENU;

          // Сохраняем обновлённую сессию обратно в Redis
          await this.redisClient.set(chatId, JSON.stringify(session));
        }
      }
    }
  }
}
