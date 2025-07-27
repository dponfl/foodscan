import { Module } from '@nestjs/common';
import { ServicesInfoSceneService } from './services-info.service';

@Module({
  providers: [ServicesInfoSceneService],
  exports: [ServicesInfoSceneService],
})
export class ServicesInfoModule {}
