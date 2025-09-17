// src/payments/payments.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from '../orders/dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('create-payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // protect this route with JWT (only authenticated users can create payment)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createCollect(dto);
  }
}
