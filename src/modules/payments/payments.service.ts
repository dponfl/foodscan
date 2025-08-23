import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInvoiceDto, CreatePaidDto } from './dto';
import { User } from 'src/modules/users/entities/user.entity';
import { PAYMENT_STATUS, PAYMENT_SUBSCRIPTION_CATEGORY } from '../../types';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class PaymentsService extends TypeOrmCrudService<Payment> {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @Inject(getRepositoryToken(Payment))
    private readonly paymentRepository: Repository<Payment>,
    @Inject(getRepositoryToken(User))
    private readonly userRepository: Repository<User>,
  ) {
    super(paymentRepository);
  }

  /**
   * Создаёт запись со статусом INVOICE.
   */
  async createInvoiceRecord(dto: CreateInvoiceDto): Promise<Payment> {
    this.logger.log(`Creating INVOICE record for clientId: ${dto.clientId}`);

    // 1. Находим пользователя по Telegram ID
    const client = await this.userRepository.findOneBy({
      clientId: dto.clientId,
    });

    if (!client) {
      throw new NotFoundException(
        `User with clientId ${dto.clientId} not found.`,
      );
    }

    // 2. Создаём запись
    const newPayment = this.paymentRepository.create({
      client,
      subsCategory: dto.subsCategory,
      amount: dto.invoice.total_amount,
      currency: dto.invoice.currency,
      status: PAYMENT_STATUS.INVOICE,
      data: JSON.stringify(dto.invoice),
    });

    return this.paymentRepository.save(newPayment);
  }

  /**
   * Создаёт запись со статусом PAID.
   */
  async createPaidRecord(dto: CreatePaidDto): Promise<Payment> {
    this.logger.log(`Creating PAID record for clientId: ${dto.clientId}`);

    const client = await this.userRepository.findOneBy({
      clientId: dto.clientId,
    });

    if (!client) {
      throw new NotFoundException(
        `User with clientId ${dto.clientId} not found.`,
      );
    }

    const subsCategory = dto.successfulPayment
      .invoice_payload as PAYMENT_SUBSCRIPTION_CATEGORY;

    const newPayment = this.paymentRepository.create({
      client,
      subsCategory,
      amount: dto.successfulPayment.total_amount,
      currency: dto.successfulPayment.currency,
      status: PAYMENT_STATUS.PAID,
      data: JSON.stringify(dto.successfulPayment),
    });

    return this.paymentRepository.save(newPayment);
  }
}
