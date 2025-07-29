import { Module } from '@nestjs/common';
import { TariffsSceneService } from './tariffs.service';

@Module({
  providers: [TariffsSceneService],
  exports: [TariffsSceneService],
})
export class TariffsModule {}
