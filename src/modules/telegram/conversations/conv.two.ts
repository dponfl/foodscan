import { Menu } from '@grammyjs/menu';
import { MyContext } from '../../../types';
import { Conversation } from '@grammyjs/conversations';

export class ConversationTwo {
  static name = 'convTwo';

  static async conversation(
    conversation: Conversation<MyContext>,
    ctx: MyContext,
  ) {
    const backMenuClone = conversation.menu('backHome').text('Back');

    await ctx.reply(`You entered Conversation 2!`, {
      reply_markup: backMenuClone,
    });
  }
}
