import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { UsersModule, UsersService } from '../users';

@Module({
  imports: [UsersModule],
  providers: [SubscriptionService, UsersService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
