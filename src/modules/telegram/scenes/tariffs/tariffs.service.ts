import { Injectable, Logger } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { CALLBACK_DATA, SCENES, WAITING_FOR_INPUT } from '../scenes.constants';
import { InlineKeyboard } from 'grammy';

@Injectable()
export class TariffsSceneService implements IScene {
  private readonly logger = new Logger(TariffsSceneService.name);

  readonly SCENE_NAME = SCENES.TARIFFS;

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = Date.now();
    ctx.session.currentScene = this.SCENE_NAME;

    const text = `💡 <b>Здоровье — это инвестиция</b>.

С E-scanner ты получаешь:

✅ Проверку состава <b>любого продукта</b>  
⚠️ Выявление <b>вредных добавок и Е-шек</b>  
🥗 Советы: что <b>НЕ есть</b>, чем заменить и <b>как защитить организм</b>  
📷 Всё просто: <b>сфоткал — получил честный разбор</b>

---

🎁 <b>Пробная версия</b>:
Ты получаешь <b>3 бесплатные проверки</b>, чтобы оценить пользу сервиса.

---

💳 Дальше:

• 1 проверка — <b>39 ₽</b> (23 ⭐️)
• 10 проверок — <b>299 ₽</b> (175 ⭐️)
• Подписка (безлимит) — <b>549 ₽ в месяц</b> (323 ⭐️) или <b>3 490 ₽ в год</b> (2 053 ⭐️)

---

🙌 <b>Почему стоит оплатить?</b>

– Ты <b>ешь каждый день</b> — и здоровье зависит от этих решений
– Сервис <b>экономит твое время</b> и бережет организм
– <b>Цена меньше, чем за кофе</b>, а польза — на годы вперёд
– Это вложение в <b>твоё самочувствие, ясность ума и долголетие</b>

---

<b>Сделай первый шаг к осознанному питанию</b>.
Нажми 👉 /buy или кнопку «✅ <b>Активировать доступ</b>» — и начни заботиться о себе уже сегодня!`;

    const keyboard = new InlineKeyboard()
      .text('✅ Активировать доступ', CALLBACK_DATA.GO_TO_PAYMENT)
      .row()
      .text('🔙 Назад', CALLBACK_DATA.GO_TO_MAIN_MENU);

    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
      await ctx.deleteMessage();
    }

    await ctx.reply(text, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  }
}
