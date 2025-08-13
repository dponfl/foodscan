import { Module } from '@nestjs/common';
import { CheckProductSceneService } from './check-product.service';

@Module({
  providers: [CheckProductSceneService],
  exports: [CheckProductSceneService],
})
export class CheckProductSceneModule {}
