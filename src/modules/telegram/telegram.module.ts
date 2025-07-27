import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ScenesOrchestratorModule } from './scenes/scenes-orchestrator.module';
import { BotConfigModule } from './bot-config/bot-config.module';

@Module({
  imports: [
    BotConfigModule,
    ScenesOrchestratorModule, // <-- Импортируем главный модуль сцен
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
