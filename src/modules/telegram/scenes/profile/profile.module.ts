import { Module } from '@nestjs/common';
import { ProfileSceneService } from './profile.service';

@Module({
  providers: [ProfileSceneService],
  exports: [ProfileSceneService],
})
export class ProfileModule {}
