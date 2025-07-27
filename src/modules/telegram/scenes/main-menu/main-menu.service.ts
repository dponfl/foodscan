import { Injectable } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { InlineKeyboard } from 'grammy';
import { CALLBACK_DATA, SCENES } from '../scenes.constants';

@Injectable()
export class MainMenuSceneService implements IScene {
  readonly SCENE_NAME = SCENES.MAIN_MENU;

  /**
   * Готовит и возвращает контент для главного меню.
   * Этот метод не зависит от 'ctx' и может быть вызван откуда угодно.
   */
  public getMainMenuPayload(): { text: string; keyboard: InlineKeyboard } {
    const text = 'Вы в главном меню. Куда отправимся дальше?';
    const keyboard = new InlineKeyboard()
      .text('ℹ️ Услуги', CALLBACK_DATA.GO_TO_SERVICES)
      .row()
      .text('🆘 Поддержка', CALLBACK_DATA.GO_TO_SUPPORT);

    return { text, keyboard };
  }

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = null;
    ctx.session.currentScene = this.SCENE_NAME;

    const { text, keyboard } = this.getMainMenuPayload();

    if (ctx.callbackQuery) {
      await ctx.editMessageText(text, { reply_markup: keyboard });
      await ctx.answerCallbackQuery();
    } else {
      await ctx.reply(text, { reply_markup: keyboard });
    }
  }
}
