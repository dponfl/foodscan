import { forwardRef, Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { UsersModule } from '../users';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), forwardRef(() => UsersModule)],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
