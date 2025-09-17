// src/orders/dto/create-order.dto.ts
import { IsString, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StudentInfo {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @ValidateNested()
  @Type(() => StudentInfo)
  student_info: StudentInfo;

  @IsString()
  @IsNotEmpty()
  gateway_name: string;

  @IsString()
  @IsOptional()
  custom_order_id?: string;
}
