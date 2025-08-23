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

    let subsCategory;

    switch (paymentOptions) {
      case PAYMENT_OPTIONS.ONE_TIME:
        this.logger.log(
          `Generating one-time payment invoice for clientId: ${ctx.from?.id}`,
        );

        subsCategory = PAYMENT_SUBSCRIPTION_CATEGORY.ONE_TIME;

        const paymentDataOneTime = {
          title: '🍔 1 Сканинг состава',
          description:
            '🔍 Проверка одного продукта на вредные добавки (Е-добавки, сахар, трансжиры и др.)',
          payload: subsCategory,
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

        await this.paymentsService.createInvoiceRecord({
          clientId,
          subsCategory,
          invoice: oneTimeInvoice.invoice,
        });

        break;
      case PAYMENT_OPTIONS.TEN_TIMES:
        this.logger.log(
          `Generating three-times payment invoice for clientId: ${ctx.from?.id}`,
        );

        subsCategory = PAYMENT_SUBSCRIPTION_CATEGORY.TEN_TIMES;

        const paymentDataThreeTimes = {
          title: '📦 10 Сканов продуктов',
          description:
            '🧪 Пакет из 10 сканирований со скидкой — удобно и выгодно',
          payload: subsCategory,
          currency: 'XTR',
          products: [{ amount: 1, label: '📦 10 Сканов продуктов' }],
        };

        const tenTimesInvoice = await ctx.replyWithInvoice(
          paymentDataThreeTimes.title,
          paymentDataThreeTimes.description,
          paymentDataThreeTimes.payload,
          paymentDataThreeTimes.currency,
          paymentDataThreeTimes.products,
        );

        await this.paymentsService.createInvoiceRecord({
          clientId,
          subsCategory,
          invoice: tenTimesInvoice.invoice,
        });

        break;
      case PAYMENT_OPTIONS.MONTH:
        this.logger.log(
          `Generating one month payment invoice for clientId: ${ctx.from?.id}`,
        );

        subsCategory = PAYMENT_SUBSCRIPTION_CATEGORY.ONE_MONTH;

        const paymentDataMonth = {
          title: '♾️ Подписка на месяц',
          description:
            '📆 Безлимитные сканы на 30 дней — проверяй всё, что ешь',
          payload: subsCategory,
          currency: 'XTR',
          products: [{ amount: 1, label: '♾️ Подписка на месяц' }],
        };

        const oneMonthInvoice = await ctx.replyWithInvoice(
          paymentDataMonth.title,
          paymentDataMonth.description,
          paymentDataMonth.payload,
          paymentDataMonth.currency,
          paymentDataMonth.products,
        );

        await this.paymentsService.createInvoiceRecord({
          clientId,
          subsCategory,
          invoice: oneMonthInvoice.invoice,
        });

        break;
      case PAYMENT_OPTIONS.YEAR:
        this.logger.log(
          `Generating one year payment invoice for clientId: ${ctx.from?.id}`,
        );

        subsCategory = PAYMENT_SUBSCRIPTION_CATEGORY.ONE_YEAR;

        const paymentDataYear = {
          title: '🛡️ Подписка на год',
          description:
            '🥇 Годовая защита: сканируй всё и всегда, неограниченно',
          payload: subsCategory,
          currency: 'XTR',
          products: [{ amount: 1, label: '🛡️ Подписка на год' }],
        };

        const oneYearInvoice = await ctx.replyWithInvoice(
          paymentDataYear.title,
          paymentDataYear.description,
          paymentDataYear.payload,
          paymentDataYear.currency,
          paymentDataYear.products,
        );

        await this.paymentsService.createInvoiceRecord({
          clientId,
          subsCategory,
          invoice: oneYearInvoice.invoice,
        });

        break;
      default:
        this.logger.warn(
          `Unknown payment option: ${paymentOptions} for chatId: ${ctx?.from?.id}`,
        );
        await ctx.answerCallbackQuery();
    }
  }
}
