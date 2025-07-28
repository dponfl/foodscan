import { Injectable } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { InlineKeyboard, InputFile } from 'grammy';
import { CALLBACK_DATA, SCENES, WAITING_FOR_INPUT } from '../scenes.constants';
import * as path from 'path';

@Injectable()
export class CheckProductSceneService implements IScene {
  readonly SCENE_NAME = SCENES.CHECK_PRODUCT;

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = WAITING_FOR_INPUT.PRODUCT_PHOTO;
    ctx.session.sceneEntryTime = Date.now();
    ctx.session.currentScene = this.SCENE_NAME;

    const photoPath = path.join(
      process.cwd(),
      'dist',
      'assets',
      'example-composition.jpg',
    );

    const backKeyboard = new InlineKeyboard().text(
      '🔙 Назад',
      CALLBACK_DATA.GO_TO_MAIN_MENU,
    );

    const instructionsPart1 = `📸 Пришли мне ОДНО фото продукта — с обратной стороны упаковки — там, где указан состав (список ингредиентов мелким шрифтом).


⚠️ Важно: пока только одно фото! Дальше я сам всё подскажу.

🧠 Пример, как должно выглядеть фото:`;
    const instructionsPart2 = `Когда будешь готов — просто пришли фото сюда, и я начну анализ.`;

    // Редактируем сообщение, если пользователь пришёл по кнопке
    if (ctx.callbackQuery) {
      // Сначала отвечаем на нажатие, чтобы убрать "загрузку"
      await ctx.answerCallbackQuery();
      // Затем удаляем старое сообщение, чтобы избежать нагромождения
      await ctx.deleteMessage();
    }

    await ctx.reply(instructionsPart1);
    await ctx.replyWithPhoto(new InputFile(photoPath), {
      caption: instructionsPart2,
      reply_markup: backKeyboard,
    });
  }
}
