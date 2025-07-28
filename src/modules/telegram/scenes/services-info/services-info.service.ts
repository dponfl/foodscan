import { Injectable } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { InlineKeyboard } from 'grammy';
import { CALLBACK_DATA, SCENES } from '../scenes.constants';

@Injectable()
export class ServicesInfoSceneService implements IScene {
  readonly SCENE_NAME = SCENES.CHECK_PRODUCT;

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = null;
    ctx.session.currentScene = this.SCENE_NAME;

    const message = 'Здесь будет информация о наших услугах и тарифах.';
    const keyboard = new InlineKeyboard().text(
      '⬅️ Назад',
      CALLBACK_DATA.GO_TO_MAIN_MENU,
    );

    // Редактируем сообщение, если пользователь пришёл по кнопке
    if (ctx.callbackQuery) {
      await ctx.editMessageText(message, { reply_markup: keyboard });
      await ctx.answerCallbackQuery();
    } else {
      await ctx.reply(message, { reply_markup: keyboard });
    }
  }
}
