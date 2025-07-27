import { Context, SessionFlavor } from 'grammy';

export type WaitingForInput = 'support_message' | 'product_photo' | null;
export interface ISessionData {
  tgName?: string;
  tgId?: number;
  tgNickname?: string;
  currentScene: string; // Имя текущей сцены
  waitingForInput?: WaitingForInput; // Какого ввода мы ждём
  sceneEntryTime?: number | null; // Время входа в сцену с ожиданием
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

export interface IScene {
  SCENE_NAME: string;
  handle: (ctx: MyContext) => Promise<void>; // Метод для входа в сцену
}

export type MyContext = Context & SessionFlavor<ISessionData>;
