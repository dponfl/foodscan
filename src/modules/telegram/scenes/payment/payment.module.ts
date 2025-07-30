import { Module } from '@nestjs/common';
import { PaymentSceneService } from './payment.service';
import { PaymentProvider } from './payment';

@Module({
  providers: [PaymentSceneService, PaymentProvider],
  exports: [PaymentSceneService, PaymentProvider],
})
export class PaymentModule {}
