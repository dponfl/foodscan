import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './modules/telegram/index';
import { DatabaseModule } from './modules/database/database.module';
import { RedisModule } from './modules/redis/index';
import { HealthModule } from './modules/health/index';
import { UsersModule } from './modules/users/index';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    RedisModule,
    TelegramModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
