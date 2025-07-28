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
  SCENES,
  TIMEOUTS,
  WAITING_FOR_INPUT,
} from './scenes.constants';
import { OpenAiService } from '../../../modules/openai';

@Injectable()
export class ScenesOrchestratorService {
  private readonly bot: Bot<MyContext>;
  private readonly logger = new Logger(ScenesOrchestratorService.name);
  private redisClient;

  constructor(
    private readonly botConfigService: BotConfigService,
    private readonly redisService: RedisService,
    private readonly startScene: StartSceneService,
    private readonly mainMenuScene: MainMenuSceneService,
    private readonly checkProductScene: CheckProductSceneService,
    private readonly supportScene: SupportSceneService,
    private readonly openAiService: OpenAiService,
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

    // ЕДИНЫЙ обработчик для всех нажатий кнопок
    this.bot.on('callback_query:data', async (ctx) => {
      const callbackData = ctx.callbackQuery.data;
      this.logger.log(`Processing callback: ${callbackData}`);

      switch (callbackData) {
        case CALLBACK_DATA.GO_TO_MAIN_MENU:
          await this.goToScene(ctx, SCENES.MAIN_MENU);
          break;
        case CALLBACK_DATA.GO_TO_CHECK_PRODUCT:
          await this.goToScene(ctx, SCENES.CHECK_PRODUCT);
          break;
        case CALLBACK_DATA.GO_TO_PRICES:
          await this.goToScene(ctx, SCENES.PRICES);
          break;
        case CALLBACK_DATA.GO_TO_STATISTICS:
          await this.goToScene(ctx, SCENES.STATISTICS);
          break;
        case CALLBACK_DATA.GO_TO_SUPPORT:
          await this.goToScene(ctx, SCENES.SUPPORT);
          break;
        // ... другие кейсы
        default:
          await ctx.answerCallbackQuery('Неизвестная команда!');
      }
    });

    const backKeyboard = new InlineKeyboard().text(
      '🔙 Назад',
      CALLBACK_DATA.GO_TO_MAIN_MENU,
    );

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
            `❗ Кажется, это не фото упаковки\\. Чтобы я смог провести анализ, мне нужен состава продукта \\(фото списка ингредиентов и т\\.д\\.\\)\\.
🔁 Пожалуйста, отправь мне фото состава — и я сразу начну проверку\\!
`,
            { reply_markup: backKeyboard, parse_mode: 'MarkdownV2' },
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
      `Received photo from ${ctx?.from?.id}: ${JSON.stringify(photo)}`,
    );

    this.logger.log(
      `Received photo from ${ctx?.from?.id}, photo[0].file_id: ${photo[0].file_id}`,
    );

    // Логика обработки фотографии

    await ctx.replyWithChatAction('typing');

    await ctx.reply(
      `Отлично\\! Я анализирую состав продукта, это может занять некоторое время…`,
      { parse_mode: 'MarkdownV2' },
    );

    const analysisResult = await this.openAiService.analyzeProductComposition(
      ctx?.message?.photo,
    );

    if (analysisResult.status === 'Success' && analysisResult.payload) {
      const successMessage =
        '🔎 Разбор состава:\n' +
        `${analysisResult.payload}\n\n` +
        '❤️ Заботься о себе — ты то, что ты ешь!';
      await ctx.reply(successMessage, { parse_mode: 'Markdown' });
    } else {
      await ctx.reply(
        'Произошла ошибка при анализе. Пожалуйста, попробуйте позже.',
      );
    }

    // ВРЕМЕННО: Очищаем состояние ожидания и возвращаем в главное меню
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = null;
    await this.mainMenuScene.handle(ctx);
  }

  // Вспомогательный метод для смены сцен
  private async goToScene(ctx: MyContext, sceneName: string) {
    ctx.session.currentScene = sceneName;
    switch (sceneName) {
      case SCENES.MAIN_MENU:
        await this.mainMenuScene.handle(ctx);
        break;
      case SCENES.CHECK_PRODUCT:
        await this.checkProductScene.handle(ctx);
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
