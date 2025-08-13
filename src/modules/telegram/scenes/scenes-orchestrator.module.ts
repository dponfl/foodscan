import { Module } from '@nestjs/common';
import { ScenesOrchestratorService } from './scenes-orchestrator.service';
import { BotConfigModule } from '../bot-config/bot-config.module';
import { StartSceneModule } from './start/start.module';
import { MainMenuSceneModule } from './main-menu/main-menu.module';
import { CheckProductSceneModule } from './check-product/check-product.module';
import { SupportModule } from './support/support.module';
import { RedisModule } from '../../redis';
import { OpenAiModule } from '../../../modules/openai';
import { TariffsModule } from './tariffs/tariffs.module';
import { PaymentModule } from './payment/payment.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    BotConfigModule,
    RedisModule,
    StartSceneModule,
    MainMenuSceneModule,
    CheckProductSceneModule,
    SupportModule,
    CheckProductSceneModule,
    SupportModule,
    OpenAiModule,
    TariffsModule,
    PaymentModule,
    ProfileModule,
  ],
  providers: [ScenesOrchestratorService],
  exports: [ScenesOrchestratorService],
})
export class ScenesOrchestratorModule {}
