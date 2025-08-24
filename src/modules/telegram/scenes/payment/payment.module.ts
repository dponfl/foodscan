import { Module } from '@nestjs/common';
import { PaymentSceneService } from './payment.service';
import { PaymentProvider } from './payment';
import { PaymentsModule, PaymentsService } from '../../../payments';

@Module({
  imports: [PaymentsModule],
  providers: [PaymentSceneService, PaymentProvider, PaymentsService],
  exports: [PaymentSceneService, PaymentProvider],
})
export class PaymentModule {}
