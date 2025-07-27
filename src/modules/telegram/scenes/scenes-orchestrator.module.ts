import { Module } from '@nestjs/common';
import { ScenesOrchestratorService } from './scenes-orchestrator.service';
import { BotConfigModule } from '../bot-config/bot-config.module';
import { StartSceneModule } from './start/start.module';
import { MainMenuSceneModule } from './main-menu/main-menu.module';
import { ServicesInfoModule } from './services-info/services-info.module';
import { SupportModule } from './support/support.module';
import { RedisModule } from '../../redis';

@Module({
  imports: [
    BotConfigModule,
    RedisModule,
    StartSceneModule,
    MainMenuSceneModule,
    ServicesInfoModule,
    SupportModule,
    ServicesInfoModule,
    SupportModule,
  ],
  providers: [ScenesOrchestratorService],
  exports: [ScenesOrchestratorService],
})
export class ScenesOrchestratorModule {}
