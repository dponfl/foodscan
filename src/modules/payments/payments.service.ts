import { Injectable, Logger } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService extends TypeOrmCrudService<Payment> {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly userRepository: Repository<Payment>,
  ) {
    super(userRepository);
  }
}
