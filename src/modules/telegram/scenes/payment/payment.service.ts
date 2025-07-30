import { Injectable, Logger } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { CALLBACK_DATA, SCENES } from '../scenes.constants';
import { InlineKeyboard } from 'grammy';

@Injectable()
export class PaymentSceneService implements IScene {
  private readonly logger = new Logger(PaymentSceneService.name);

  readonly SCENE_NAME = SCENES.PAYMENT;

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = Date.now();
    ctx.session.currentScene = this.SCENE_NAME;

    const text = `💳 Выбери удобный для себя способ:
Ты можешь начать с одной проверки — или взять безлимитную подписку и не думать о лимитах\\.
👇 Выбери подходящий вариант:
`;

    const keyboard = new InlineKeyboard()
      .text(
        `🔍 1 проверка: 39 ₽ (23 ⭐️)`,
        CALLBACK_DATA.GO_TO_PAYMENT_OPTION_ONE,
      )
      .row()
      .text(`📦 10 проверок: 299 ₽ (175 ⭐️)`)
      .row()
      .text(`♾ 1 месяц: 549 ₽ (323 ⭐️)`)
      .row()
      .text(`🗓 1 год: 3 490 ₽ (2 053 ⭐️)`)
      .row()
      .text(`🔙 Назад`, CALLBACK_DATA.GO_TO_TARIFFS);

    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
      await ctx.deleteMessage();
    }

    await ctx.reply(text, {
      parse_mode: 'MarkdownV2',
      reply_markup: keyboard,
    });
  }
}
