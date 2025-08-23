import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './modules/telegram/index';
import { DatabaseModule } from './modules/database/database.module';
import { RedisModule } from './modules/redis/index';
import { HealthModule } from './modules/health/index';
import { UsersModule } from './modules/users/index';
import { OpenAiModule } from './modules/openai/openai.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './helpers/common/common.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    UsersModule,
    PaymentsModule,
    RedisModule,
    TelegramModule,
    HealthModule,
    OpenAiModule,
    CommonModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
