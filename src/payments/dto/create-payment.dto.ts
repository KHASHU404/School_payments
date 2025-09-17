// src/payments/dto/create-payment.dto.ts
import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StudentInfoDto {
  @IsString() name: string;
  @IsString() id: string;
  @IsOptional() @IsString() email?: string;
}

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsNotEmpty()
  amount: string; // string by provider contract

  @IsString()
  @IsOptional()
  callback_url?: string;

  @ValidateNested()
  @Type(() => StudentInfoDto)
  @IsOptional()
  student_info?: StudentInfoDto;

  @IsString()
  @IsOptional()
  custom_order_id?: string;

  @IsString()
  @IsOptional()
  gateway_name?: string;
}
