export enum PAYMENT_SUBSCRIPTION_CATEGORY {
  ONE_TIME = 'one_time',
  TEN_TIMES = 'ten_times',
  ONE_MONTH = 'one_month',
  ONE_YEAR = 'one_year',
}

export enum PAYMENT_STATUS {
  INVOICE = 'invoice',
  PAID = 'paid',
  FAILED = 'failed',
}

export interface ITelegramInvoice {
  title: string;
  description: string;
  start_parameter: string;
  currency: string;
  total_amount: number;
}

export interface ITelegramSuccessfulPayment {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
}
