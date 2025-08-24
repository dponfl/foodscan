import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { format } from 'date-fns';
import { IScene, MyContext } from '../../../../types';
import { CALLBACK_DATA, SCENES } from '../scenes.constants';
import { InlineKeyboard } from 'grammy';
import { SubscriptionService } from '../../../subscription';

@Injectable()
export class ProfileSceneService implements IScene {
  private readonly logger = new Logger(ProfileSceneService.name);

  constructor(private readonly subsriptionService: SubscriptionService) {}

  readonly SCENE_NAME = SCENES.PROFILE;

  async handle(ctx: MyContext): Promise<void> {
    ctx.session.waitingForInput = null;
    ctx.session.sceneEntryTime = Date.now();
    ctx.session.currentScene = this.SCENE_NAME;

    // TODO: Нужно вернуть результаты из базы

    const clientId = ctx.from?.id;

    if (!clientId) {
      this.logger.error(`No clientId: ${clientId}`);
      throw new ForbiddenException(`No clientId: ${clientId}`);
    }

    const subscriptionInfo = await this.subsriptionService.getStatus(clientId);

    const subscriptionEndDate = subscriptionInfo.subscriptionUntil
      ? `активна до ${format(subscriptionInfo.subscriptionUntil, 'dd.MM.yyyy')}`
      : 'не активна';

    const text = `Твой профиль:
• Осталось бесплатных проверок: ${subscriptionInfo.freeChecks}  
• Купленных проверок: ${subscriptionInfo.paidChecks}  
• Подписка: ${subscriptionEndDate}`;

    const keyboard = new InlineKeyboard()
      .text('✅ Продлить подписку', CALLBACK_DATA.GO_TO_PAYMENT)
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
