import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { User } from '../users';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User])],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [TypeOrmModule, PaymentsService],
})
export class PaymentsModule {}
