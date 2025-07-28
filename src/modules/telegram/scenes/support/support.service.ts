import { Injectable } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { InlineKeyboard } from 'grammy';
import { CALLBACK_DATA, SCENES, WAITING_FOR_INPUT } from '../scenes.constants';

@Injectable()
export class SupportSceneService implements IScene {
  readonly SCENE_NAME = SCENES.SUPPORT;

  async handle(ctx: MyContext): Promise<void> {
    const message =
      'Пожалуйста, опишите ваш вопрос или проблему одним сообщением. Я передам его в службу поддержки.';
    const keyboard = new InlineKeyboard().text(
      '⬅️ Назад',
      CALLBACK_DATA.GO_TO_MAIN_MENU,
    );

    // Устанавливаем состояние "ожидания"
    ctx.session.waitingForInput = WAITING_FOR_INPUT.SUPPORT;
    ctx.session.sceneEntryTime = Date.now(); // Засекаем время

    if (ctx.callbackQuery) {
      await ctx.editMessageText(message, { reply_markup: keyboard });
      await ctx.answerCallbackQuery();
    } else {
      await ctx.reply(message, { reply_markup: keyboard });
    }
  }
}
