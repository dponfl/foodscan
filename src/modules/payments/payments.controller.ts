import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';

@Crud({
  model: {
    type: Payment,
  },
})
@Controller('payments')
export class PaymentsController implements CrudController<Payment> {
  constructor(public service: PaymentsService) {}
}
