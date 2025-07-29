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
    const text = `Ты находишся в *главном меню*\\. Что будем делать?
Выбирай нужный пункт ниже — и продолжим 👇
`;
    const keyboard = new InlineKeyboard()
      .text('🔍 Проверить продукт', CALLBACK_DATA.GO_TO_CHECK_PRODUCT)
      .row()
      .text('💡 Тарифы и возможности', CALLBACK_DATA.GO_TO_TARIFFS)
      .row()
      .text('📊 Статистика', CALLBACK_DATA.GO_TO_STATISTICS)
      .text('⚙️ Поддержка', CALLBACK_DATA.GO_TO_SUPPORT);

    return { text, keyboard };
  }

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = Date.now();
    ctx.session.currentScene = this.SCENE_NAME;

    const { text, keyboard } = this.getMainMenuPayload();

    // Если пользователь пришёл по нажатию кнопки, нужно "отпустить" и удалить её,
    // чтобы убрать индикатор загрузки.
    if (ctx.callbackQuery) {
      await ctx.editMessageReplyMarkup();
      await ctx.answerCallbackQuery();
    }

    // Вне зависимости от того, как пользователь попал в эту сцену,
    // мы всегда отправляем новое сообщение с главным меню.
    await ctx.reply(text, { parse_mode: 'MarkdownV2', reply_markup: keyboard });
  }
}
