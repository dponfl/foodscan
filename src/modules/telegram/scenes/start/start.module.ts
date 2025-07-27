import { Module } from '@nestjs/common';
import { UsersModule } from '../../../users';
import { StartSceneService } from './start.service';

@Module({
  imports: [UsersModule],
  providers: [StartSceneService],
  exports: [StartSceneService],
})
export class StartSceneModule {}
