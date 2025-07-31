import { Injectable, Logger } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { CALLBACK_DATA, SCENES } from '../scenes.constants';
import { InlineKeyboard } from 'grammy';

@Injectable()
export class ProfileSceneService implements IScene {
  private readonly logger = new Logger(ProfileSceneService.name);

  readonly SCENE_NAME = SCENES.PROFILE;

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = Date.now();
    ctx.session.currentScene = this.SCENE_NAME;

    const text = `Твой профиль:
• Осталось бесплатных проверок: 0  
• Купленных проверок: 3  
• Подписка: активна до 12\\.05\\.2025  
• Статус: обычный пользователь`;

    const keyboard = new InlineKeyboard()
      .text('✅ Продлить подписку', CALLBACK_DATA.GO_TO_PAYMENT)
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
