import { Menu } from '@grammyjs/menu';
import { MyContext } from '../../../types';
import { Conversation } from '@grammyjs/conversations';

export class ConversationOne {
  static name = 'convOne';

  static async conversation(
    conversation: Conversation<MyContext>,
    ctx: MyContext,
  ) {
    const backMenuClone = conversation.menu('backHome').text('Back');

    ctx.editMessageReplyMarkup({});

    await ctx.reply(`You entered Conversation 1!`, {
      reply_markup: backMenuClone,
    });
  }
}
