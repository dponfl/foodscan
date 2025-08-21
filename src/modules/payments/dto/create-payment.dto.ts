import { IsEnum, IsNotEmpty, IsObject } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import {
  ITelegramInvoice,
  ITelegramSuccessfulPayment,
  PAYMENT_SUBSCRIPTION_CATEGORY,
} from '../../../types';

export class CreateInvoicePaymentDto {
  @IsNotEmpty()
  user: User;

  @IsEnum(PAYMENT_SUBSCRIPTION_CATEGORY)
  subsCategory: PAYMENT_SUBSCRIPTION_CATEGORY;

  @IsObject()
  invoice: ITelegramInvoice;
}

export class CreateSuccessfulPaymentDto {
  @IsObject()
  successfulPayment: ITelegramSuccessfulPayment;
}
