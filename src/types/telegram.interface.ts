import { Context, SessionFlavor } from 'grammy';
import { WAITING_FOR_INPUT } from '../modules/telegram/scenes/scenes.constants';

export type WaitingForInput = WAITING_FOR_INPUT | null;
export interface ISessionData {
  tgName?: string;
  tgId?: number;
  tgNickname?: string;
  tgLang?: string;
  currentScene: string; // Имя текущей сцены
  waitingForInput?: WaitingForInput; // Какого ввода мы ждём
  sceneEntryTime?: number | null; // Время входа в сцену с ожиданием
  photo?: any;
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
