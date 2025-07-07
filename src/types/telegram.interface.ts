export interface ITelegramPaymentProduct {
  amount: number;
  label: string;
}

export interface ITelegramStarsPaymentPayload {
  title: string;
  description: string;
  payload: string;
  currency: string;
  products: ITelegramPaymentProduct[];
}
