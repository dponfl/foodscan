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

        const paymentData = {
          title: '🍔 1 Сканинг состава',
          description:
            '🔍 Проверка одного продукта на вредные добавки (Е-добавки, сахар, трансжиры и др.)',
          payload: '{}',
          currency: 'XTR',
          products: [{ amount: 1, label: '🍔 1 Сканинг состава' }],
        };

        await ctx.replyWithInvoice(
          paymentData.title,
          paymentData.description,
          paymentData.payload,
          paymentData.currency,
          paymentData.products,
        );
        break;
      default:
    }
  }
}
