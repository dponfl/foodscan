import { Module } from '@nestjs/common';
import { SupportSceneService } from './support.service';

@Module({
  providers: [SupportSceneService],
  exports: [SupportSceneService],
})
export class SupportModule {}
