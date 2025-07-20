import { Menu } from '@grammyjs/menu';
import { MyContext } from '../../../types';
import { Conversation } from '@grammyjs/conversations';

export class ConversationHome {
  static name = 'home';

  static menu() {
    return new Menu<MyContext>('home')
      .text('Conversation 1', async (ctx) => {
        console.log('111');
        await ctx.conversation.enter('convOne');
        console.log('222');
        await ctx.conversation.exitOne;
      })
      .text('Conversation 2', (ctx) => ctx.conversation.enter('convTwo'));
  }

  static menuBackHome() {
    return new Menu<MyContext>('backHome').text('Back', async (ctx) => {
      console.log('333');
      await ctx.conversation.enter('home');
      console.log('444');
      await ctx.conversation.exitOne;
    });
  }

  static async conversation(
    conversation: Conversation<MyContext>,
    ctx: MyContext,
  ) {
    const homeMenuClone = conversation
      .menu('home')
      .text('Conversation 1')
      .text('Conversation 2');

    await ctx.reply(`You entered Conversation Home!`, {
      reply_markup: homeMenuClone,
    });
  }
}
