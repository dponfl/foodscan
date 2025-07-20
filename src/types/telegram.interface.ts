import { ConversationFlavor } from '@grammyjs/conversations';
import { Context, SessionFlavor } from 'grammy';

export interface ISessionData {
  name?: string;
  email?: string;
}
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

export type MyContext = ConversationFlavor<
  Context & SessionFlavor<ISessionData>
>;
