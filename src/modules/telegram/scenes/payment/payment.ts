import { Injectable, Logger } from '@nestjs/common';
import { MyContext } from '../../../../types';
import { PAYMENT_OPTIONS } from '../scenes.constants';

@Injectable()
export class PaymentProvider {
  private readonly logger = new Logger(PaymentProvider.name);

  async generatePaymentInvoce(
    ctx: MyContext,
    paymentOptions: PAYMENT_OPTIONS,
  ): Promise<void> {
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
      await ctx.deleteMessage();
    }

    switch (paymentOptions) {
      case PAYMENT_OPTIONS.ONE_TIME:
        this.logger.log(
          `Generating one-time payment invoice for clientId: ${ctx.from?.id}`,
        );

        const paymentDataOneTime = {
          title: '🍔 1 Сканинг состава',
          description:
            '🔍 Проверка одного продукта на вредные добавки (Е-добавки, сахар, трансжиры и др.)',
          payload: '{}',
          currency: 'XTR',
          products: [{ amount: 1, label: '🍔 1 Сканинг состава' }],
        };

        await ctx.replyWithInvoice(
          paymentDataOneTime.title,
          paymentDataOneTime.description,
          paymentDataOneTime.payload,
          paymentDataOneTime.currency,
          paymentDataOneTime.products,
        );
        break;
      case PAYMENT_OPTIONS.THREE_TIMES:
        this.logger.log(
          `Generating three-times payment invoice for clientId: ${ctx.from?.id}`,
        );

        const paymentDataThreeTimes = {
          title: '📦 10 Сканов продуктов',
          description:
            '🧪 Пакет из 10 сканирований со скидкой — удобно и выгодно',
          payload: '{}',
          currency: 'XTR',
          products: [{ amount: 1, label: '📦 10 Сканов продуктов' }],
        };

        await ctx.replyWithInvoice(
          paymentDataThreeTimes.title,
          paymentDataThreeTimes.description,
          paymentDataThreeTimes.payload,
          paymentDataThreeTimes.currency,
          paymentDataThreeTimes.products,
        );
        break;
      case PAYMENT_OPTIONS.MONTH:
        this.logger.log(
          `Generating one month payment invoice for clientId: ${ctx.from?.id}`,
        );

        const paymentDataMonth = {
          title: '♾️ Подписка на месяц',
          description:
            '📆 Безлимитные сканы на 30 дней — проверяй всё, что ешь',
          payload: '{}',
          currency: 'XTR',
          products: [{ amount: 1, label: '♾️ Подписка на месяц' }],
        };

        await ctx.replyWithInvoice(
          paymentDataMonth.title,
          paymentDataMonth.description,
          paymentDataMonth.payload,
          paymentDataMonth.currency,
          paymentDataMonth.products,
        );
        break;
      case PAYMENT_OPTIONS.YEAR:
        this.logger.log(
          `Generating one year payment invoice for clientId: ${ctx.from?.id}`,
        );

        const paymentDataYear = {
          title: '🛡️ Подписка на год',
          description:
            '🥇 Годовая защита: сканируй всё и всегда, неограниченно',
          payload: '{}',
          currency: 'XTR',
          products: [{ amount: 1, label: '🛡️ Подписка на год' }],
        };

        await ctx.replyWithInvoice(
          paymentDataYear.title,
          paymentDataYear.description,
          paymentDataYear.payload,
          paymentDataYear.currency,
          paymentDataYear.products,
        );
        break;
      default:
        this.logger.warn(
          `Unknown payment option: ${paymentOptions} for chatId: ${ctx?.from?.id}`,
        );
        await ctx.answerCallbackQuery();
    }
  }
}
