// src/orders/dto/pay-order.dto.ts
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class PayOrderDto {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'paid', 'failed'])
  status: string;
}
