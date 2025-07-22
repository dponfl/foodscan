import { Menu } from '@grammyjs/menu';
import { MyContext } from '../../../types';
import { Conversation } from '@grammyjs/conversations';
import { CommonHelpers } from 'src/helpers';

export class ConversationOne {
  static name = 'convOne';

  static async conversation(
    conversation: Conversation<MyContext>,
    ctx: MyContext,
  ) {
    const backMenuClone = conversation.menu('backHome').text('Back');

    ctx.editMessageReplyMarkup({});

    const timeoutMilliseconds = 10 * 1000;

    await ctx.reply(
      `You entered Conversation 1! Pls send me a photo within ${timeoutMilliseconds / 1000} seconds`,
      {
        reply_markup: backMenuClone,
      },
    );

    console.log('Waiting for a photo...');

    let convOneTimeout;

    // console.log(`photo: ${photo}`);
    clearTimeout(convOneTimeout);
    conversation.external(async (ctx) => {
      console.log('777');
      await ctx.conversation.exitOne;
      console.log('888');
      await ctx.conversation.enter('home');
      console.log('999');
    });

    // conversation.external(async (ctx) => {
    //   console.log('777');
    //   // await ctx.conversation.exitOne;
    //   // console.log('888');
    //   await ctx.conversation.enter('home');
    //   console.log('999');
    // });

    // let myPromise = new Promise((resolve) => {
    //   convOneTimeout = setTimeout(() => {
    //     console.log('Timeout!');
    //     resolve(null);
    //   }, timeoutMilliseconds);
    // });

    // const photo = await Promise.race([
    //   myPromise,
    //   conversation.waitFor(':photo', {
    //     otherwise: (ctx) => {
    //       clearTimeout(convOneTimeout);
    //       myPromise = new Promise((resolve) => {
    //         convOneTimeout = setTimeout(() => {
    //           console.log('Timeout!');
    //           resolve(null);
    //         }, timeoutMilliseconds);
    //       });
    //       ctx.reply(
    //         `This is not a photo! Send me a photo within ${timeoutMilliseconds / 1000} seconds, please!`,
    //       );
    //     },
    //   }),
    // ]);

    // console.log(`photo: ${photo}`);
    // clearTimeout(convOneTimeout);
    // conversation.external(async (ctx) => {
    //   await ctx.conversation.enter('home');
    //   await ctx.conversation.exitOne;
    // });

    return;
  }
}
