import { Module } from '@nestjs/common';
import { ProfileSceneService } from './profile.service';
import { SubscriptionModule, SubscriptionService } from '../../../subscription';
import { UsersModule } from '../../../users';

@Module({
  imports: [SubscriptionModule, UsersModule],
  providers: [ProfileSceneService, SubscriptionService],
  exports: [ProfileSceneService],
})
export class ProfileModule {}
