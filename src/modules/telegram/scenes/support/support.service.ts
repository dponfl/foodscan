import { Injectable } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { InlineKeyboard } from 'grammy';
import { CALLBACK_DATA, SCENES, WAITING_FOR_INPUT } from '../scenes.constants';

@Injectable()
export class SupportSceneService implements IScene {
  readonly SCENE_NAME = SCENES.SUPPORT;

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = Date.now();
    ctx.session.currentScene = this.SCENE_NAME;

    const text = `Команды, которые помогут тебе:
1\\. /check — начать проверку продукта  
2\\. /profile — посмотреть свой статус  
3\\. /pricing — тарифы и подписки  
4\\. /buy — оформить подписку

❓ Если что\\-то пошло не так — напиши в поддержку:  
@support\\_e\\-scanner\\_bot
`;

    const keyboard = new InlineKeyboard()
      .text('🔍Проверить продукт', CALLBACK_DATA.GO_TO_CHECK_PRODUCT)
      .row()
      .text('🔙 Назад', CALLBACK_DATA.GO_TO_MAIN_MENU);

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
