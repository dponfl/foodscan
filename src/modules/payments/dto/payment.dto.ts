// src/modules/payments/dto/payment.dto.ts

import { IsEnum, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import {
  ITelegramInvoice,
  ITelegramSuccessfulPayment,
  PAYMENT_SUBSCRIPTION_CATEGORY,
} from '../../../types';

// DTO для создания записи об ИНВОЙСЕ
export class CreateInvoiceDto {
  @IsNumber()
  clientId: number;

  @IsEnum(PAYMENT_SUBSCRIPTION_CATEGORY)
  subsCategory: PAYMENT_SUBSCRIPTION_CATEGORY;

  @IsObject()
  invoice: ITelegramInvoice;
}

// DTO для создания записи об УСПЕШНОМ ПЛАТЕЖЕ
export class CreatePaidDto {
  @IsNumber()
  clientId: number;

  @IsObject()
  successfulPayment: ITelegramSuccessfulPayment;
}
