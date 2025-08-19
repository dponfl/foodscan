import { Injectable, Logger } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { UsersService } from '../../../users';
import { SCENES } from '../scenes.constants';

@Injectable()
export class StartSceneService implements IScene {
  readonly SCENE_NAME = SCENES.START;

  private readonly logger = new Logger(StartSceneService.name, {
    timestamp: true,
  });

  constructor(private readonly usersService: UsersService) {}

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = Date.now();
    ctx.session.currentScene = this.SCENE_NAME;

    const user = ctx.from;
    if (user) {
      ctx.session.tgId = ctx.from.id || 0;
      ctx.session.tgName = ctx.from.first_name || '';
      ctx.session.tgNickname = ctx.from.username || '';
      ctx.session.tgLang = ctx.from.language_code || 'ru';

      await this.usersService.findOrCreate({
        clientId: user.id,
        userName: user.first_name,
        userNick: user.username,
        lang: user.language_code || 'ru',
      });
    }

    const startText = `👋 Привет! Я — твой помощник <b>E-scanner</b>

Просто пришли мне фото продукта — и я расскажу тебе всю правду о его составе:

🔍 Что внутри:
• Какие <b>Е-добавки</b> там спрятаны
• Насколько они <b>вредны</b> для организма
• Что может быть <b>опасным для здоровья</b>
• И что <b>пропить</b>, чтобы нейтрализовать вред

🧠 Зачем это нужно?

Почти каждый день мы едим продукты, даже не догадываясь, что они могут:

⚠️ Нарушать работу <b>желудка и кишечника</b>
⚡ Влиять на <b>энергию и самочувствие</b>
😴 Портить <b>сон и настроение</b>
🧠 И даже снижать <b>концентрацию и память</b>

Я помогу тебе <b>осознанно выбирать еду</b>, а значит —
<b>дольше быть энергичным, здоровым и бодрым!</b>
---
🔥 Готов узнать, что ты действительно ешь?
Жми 👉 /check — или кнопку ниже <b>«Проверить продукт»</b> и начнём проверку! 🔎`;

    await ctx.reply(startText, { parse_mode: 'HTML' });
  }
}
