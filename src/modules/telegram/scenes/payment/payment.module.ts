import { Module } from '@nestjs/common';
import { PaymentSceneService } from './payment.service';

@Module({
  providers: [PaymentSceneService],
  exports: [PaymentSceneService],
})
export class PaymentModule {}
