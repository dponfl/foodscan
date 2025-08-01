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

    const startText = `👋 Привет\\! Я — твой помощник *E\\-scanner*

Просто пришли мне фото продукта — и я расскажу тебе всю правду о его составе:

🔍 Что внутри:
• Какие *Е\\-добавки* там спрятаны
• Насколько они *вредны* для организма
• Что может быть *опасным для здоровья*
• И что *пропить*, чтобы нейтрализовать вред

🧠 Зачем это нужно\\?

Почти каждый день мы едим продукты, даже не догадываясь, что они могут:

⚠️ Нарушать работу *желудка и кишечника*
⚡ Влиять на *энергию и самочувствие*
😴 Портить *сон и настроение*
🧠 И даже снижать *концентрацию и память*

Я помогу тебе *осознанно выбирать еду*, а значит —
*дольше быть энергичным, здоровым и бодрым\\!*
\\-\\-\\-
🔥 Готов узнать, что ты действительно ешь\\?
Жми 👉 /check — или кнопку ниже *«Проверить продукт»* и начнём проверку\\! 🔎`;

    await ctx.reply(startText, { parse_mode: 'MarkdownV2' });
  }
}
