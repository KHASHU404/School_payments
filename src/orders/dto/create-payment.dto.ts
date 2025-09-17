// src/payments/dto/create-payment.dto.ts
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsNotEmpty()
  amount: string; // as required by payment API (string)

  @IsString()
  @IsOptional()
  callback_url?: string;
}
