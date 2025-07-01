import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  constructor(private readonly configService: ConfigService) {}
  test() {
    const tgToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    console.log(`tgToken: ${tgToken}`);
  }
}
