import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './modules/telegram/telegram.module';
import { TelegramService } from './modules/telegram/telegram.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TelegramModule],
  controllers: [AppController],
  providers: [AppService, TelegramService],
})
export class AppModule {}
