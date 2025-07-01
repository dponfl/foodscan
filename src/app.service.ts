import { Injectable } from '@nestjs/common';
import { TelegramService } from './modules/telegram/telegram.service';

@Injectable()
export class AppService {
  constructor(private readonly telegramService: TelegramService) {}
  getHello(): string {
    this.telegramService.test();
    return 'Hello World!';
  }
}
