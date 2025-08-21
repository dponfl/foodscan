import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
import { User } from 'src/modules/users/entities/user.entity';
import { PAYMENT_STATUS } from '../../types';

@Injectable()
export class PaymentsService extends TypeOrmCrudService<Payment> {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(paymentRepository);
  }

  async createInvoice(dto: CreatePaymentDto): Promise<Payment> {
    this.logger.log(
      `Creating invoice record for clientId: ${dto.user.clientId} userId: ${dto.user.id}`,
    );

    const newPayment = this.paymentRepository.create({
      client: dto.user,
      subsCategory: dto.subsCategory,
      amount: dto.invoice.total_amount,
      currency: dto.invoice.currency,
      status: PAYMENT_STATUS.INVOICE,
      data: JSON.stringify(dto.invoice),
    });

    return this.paymentRepository.save(newPayment);
  }

  async updateStatusOnSuccess(dto: UpdatePaymentDto): Promise<Payment> {
    const { successfulPayment } = dto;
    const paymentId = successfulPayment.invoice_payload;

    this.logger.log(`Updating payment record ${paymentId} to PAID`);

    const payment = await this.paymentRepository.findOneBy({ id: paymentId });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found.`);
    }

    payment.status = PAYMENT_STATUS.PAID;
    payment.data = JSON.stringify(successfulPayment);

    return this.paymentRepository.save(payment);
  }
}
