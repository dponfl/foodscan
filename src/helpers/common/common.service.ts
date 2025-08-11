import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ITelegramPhotoSize } from '../../types';
import axios from 'axios';

@Injectable()
export class CommonService {
  private tgToken;

  private readonly logger = new Logger(CommonService.name);

  constructor(private readonly configService: ConfigService) {
    this.tgToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!this.tgToken) {
      this.logger.error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables!',
      );
      throw new Error(
        'TELEGRAM_BOT_TOKEN is not defined in environment variables!',
      );
    }
  }

  static getUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static getTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Приостанавливает выполнение на указанное количество миллисекунд.
   * @param ms - Время задержки в миллисекундах.
   */
  // static sleep(ms: number): Promise<undefined>;
  /**
   * Приостанавливает выполнение и возвращает указанное значение.
   * @param ms - Время задержки в миллисекундах.
   * @param value - Значение, которое будет возвращено после задержки.
   */
  // static sleep<T>(ms: number, value: T): Promise<T>;

  // Реализация
  static sleep<T>(ms: number, value?: T): Promise<T | undefined> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
  }

  /**
   * Преобразует изображение из сообщения Telegram в Base64 Data URL.
   * @param photoArray - Массив размеров фото из объекта сообщения Telegram.
   * @returns Промис, который разрешается строкой в формате Data URL.
   */

  async getBase64UrlFromTelegramPhoto(
    photoArray: ITelegramPhotoSize[],
  ): Promise<string> {
    if (!photoArray || photoArray.length === 0) {
      throw new Error('Photo array is empty.');
    }

    // 1. Выбираем изображение самого высокого качества (последнее в массиве)
    const bestQualityPhoto = photoArray[photoArray.length - 1];
    const fileId = bestQualityPhoto.file_id;

    // 2. Получаем file_path через Telegram Bot API
    const getFileUrl = `https://api.telegram.org/bot${this.tgToken}/getFile?file_id=${fileId}`;
    const fileApiResponse = await axios.get(getFileUrl);

    const filePath = fileApiResponse.data.result.file_path;
    if (!filePath) {
      throw new Error('Cannot get file_path from Telegram API.');
    }

    // 3. Формируем URL для скачивания файла и получаем его как бинарный буфер
    const fileDownloadUrl = `https://api.telegram.org/file/bot${this.tgToken}/${filePath}`;
    const imageResponse = await axios.get(fileDownloadUrl, {
      responseType: 'arraybuffer',
    });

    // 4. Кодируем буфер в Base64 и формируем Data URL
    const base64String = Buffer.from(imageResponse.data, 'binary').toString(
      'base64',
    );

    // Определяем MIME тип (для большинства фото из Telegram это jpeg)
    const mimeType = 'image/jpeg';

    return `data:${mimeType};base64,${base64String}`;
  }
}
