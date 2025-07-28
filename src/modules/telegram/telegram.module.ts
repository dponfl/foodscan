import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ScenesOrchestratorModule } from './scenes/scenes-orchestrator.module';
import { BotConfigModule } from './bot-config/bot-config.module';

@Module({
  imports: [BotConfigModule, ScenesOrchestratorModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
