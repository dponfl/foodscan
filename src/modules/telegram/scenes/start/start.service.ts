import { Injectable, Logger } from '@nestjs/common';
import { IScene, MyContext } from '../../../../types';
import { Api, Bot, RawApi } from 'grammy';
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
    ctx.session.sceneEntryTime = null;
    ctx.session.currentScene = this.SCENE_NAME;

    const user = ctx.from;
    if (user) {
      await this.usersService.findOrCreate({
        clientId: user.id,
        userName: user.first_name,
        userNick: user.username,
        lang: user.language_code || 'ru',
      });
    }

    const message = `👋🏻 Привет\\! Я бот для заказа *еды из ресторанов*\\. Подробнее о сервисе можно узнать в меню\\.`;
    // При первом входе мы сразу переводим пользователя в главное меню
    // Поэтому здесь можно не отправлять клавиатуру, а сразу вызвать mainMenuScene.handle()
    // Но для чистоты примера, предположим, что старт - это отдельный экран.
    await ctx.reply(message, { parse_mode: 'MarkdownV2' });
  }
}
