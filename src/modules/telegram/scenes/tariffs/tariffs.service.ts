import { Injectable } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { CALLBACK_DATA, SCENES, WAITING_FOR_INPUT } from '../scenes.constants';
import { InlineKeyboard } from 'grammy';

@Injectable()
export class TariffsSceneService implements IScene {
  readonly SCENE_NAME = SCENES.TARIFFS;

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = Date.now();
    ctx.session.currentScene = this.SCENE_NAME;

    const keyboard = new InlineKeyboard()
      .text('✅ Активировать доступ', CALLBACK_DATA.GO_TO_PAYMENT)
      .row()
      .text('🔙 Назад', CALLBACK_DATA.GO_TO_MAIN_MENU);

    const text = `💡 Здоровье — это инвестиция\\.

С E\\-scanner ты получаешь:

✅ Проверку состава любого продукта  
⚠️ Выявление вредных добавок и Е\\-шек  
🥗 Советы: что НЕ есть, чем заменить и как защитить организм  
📷 Всё просто: сфоткал — получил честный разбор

\\-\\-\\-

🎁 Пробная версия:
Ты получаешь 3 бесплатные проверки, чтобы оценить пользу сервиса\\.

\\-\\-\\-

💳 Дальше:

• 1 проверка — 39 ₽ \\(23 ⭐️\\)
• 10 проверок — 299 ₽ \\(175 ⭐️\\)
• Подписка \\(безлимит\\) — 549 ₽ в месяц \\(323 ⭐️\\) или 3 490 ₽ в год \\(2 053 ⭐️\\)

\\-\\-\\-

🙌 Почему стоит оплатить?

– Ты ешь каждый день — и здоровье зависит от этих решений  
– Сервис экономит твое время и бережет организм  
– Цена меньше, чем за кофе, а польза — на годы вперёд  
– Это вложение в твоё самочувствие, ясность ума и долголетие

\\-\\-\\-

Сделай первый шаг к осознанному питанию\\.
Нажми 👉 /buy или кнопку «✅ Активировать доступ» — и начни заботиться о себе уже сегодня\\!`;

    // Редактируем сообщение, если пользователь пришёл по кнопке
    if (ctx.callbackQuery) {
      // Сначала отвечаем на нажатие, чтобы убрать "загрузку"
      await ctx.answerCallbackQuery();
      // Затем удаляем старое сообщение, чтобы избежать нагромождения
      await ctx.deleteMessage();
    }

    await ctx.reply(text, {
      parse_mode: 'MarkdownV2',
      reply_markup: keyboard,
    });
  }
}
