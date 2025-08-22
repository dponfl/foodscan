import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MyContext, PAYMENT_SUBSCRIPTION_CATEGORY } from '../../../../types';
import { PAYMENT_OPTIONS } from '../scenes.constants';
import { PaymentsService } from '../../../payments';

@Injectable()
export class PaymentProvider {
  private readonly logger = new Logger(PaymentProvider.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  async generatePaymentInvoce(
    ctx: MyContext,
    paymentOptions: PAYMENT_OPTIONS,
  ): Promise<void> {
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
      await ctx.deleteMessage();
    }

    if (!ctx.from?.id) {
      throw new NotFoundException(
        `No clientId -> ctx.from.id: ${ctx.from?.id}`,
      );
    }

    const clientId = ctx.from.id;

    switch (paymentOptions) {
      case PAYMENT_OPTIONS.ONE_TIME:
        this.logger.log(
          `Generating one-time payment invoice for clientId: ${ctx.from?.id}`,
        );

        const paymentDataOneTime = {
          title: '🍔 1 Сканинг состава',
          description:
            '🔍 Проверка одного продукта на вредные добавки (Е-добавки, сахар, трансжиры и др.)',
          payload: JSON.stringify({
            subsCategory: PAYMENT_SUBSCRIPTION_CATEGORY.ONE_TIME,
          }),
          currency: 'XTR',
          products: [{ amount: 1, label: '🍔 1 Сканинг состава' }],
        };

        const oneTimeInvoice = await ctx.replyWithInvoice(
          paymentDataOneTime.title,
          paymentDataOneTime.description,
          paymentDataOneTime.payload,
          paymentDataOneTime.currency,
          paymentDataOneTime.products,
        );

        // await this.paymentsService.createInvoiceRecord({
        //   clientId,
        //   subsCategory: PAYMENT_SUBSCRIPTION_CATEGORY.ONE_TIME,
        //   invoice: oneTimeInvoice.invoice,
        // });

        break;
      case PAYMENT_OPTIONS.TEN_TIMES:
        this.logger.log(
          `Generating three-times payment invoice for clientId: ${ctx.from?.id}`,
        );

        const paymentDataThreeTimes = {
          title: '📦 10 Сканов продуктов',
          description:
            '🧪 Пакет из 10 сканирований со скидкой — удобно и выгодно',
          payload: JSON.stringify({
            subsCategory: PAYMENT_SUBSCRIPTION_CATEGORY.TEN_TIMES,
          }),
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
          payload: JSON.stringify({
            subsCategory: PAYMENT_SUBSCRIPTION_CATEGORY.ONE_MONTH,
          }),
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
          payload: JSON.stringify({
            subsCategory: PAYMENT_SUBSCRIPTION_CATEGORY.ONE_YEAR,
          }),
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
