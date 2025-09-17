// src/payments/payments.controller.ts
import { Controller, Post, Body, Req, Res, UseGuards, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard('jwt'))
 @Post('create-payment')
async createPayment(@Body() dto: CreatePaymentDto, @Req() req: Request, @Res() res: Response) {
  try {
    console.log('Create payment request body:', dto);
    const result = await this.paymentsService.createPayment(dto);
    console.log('Create payment result:', result);
    return res.json(result);
  } catch (error) {
    console.error('Create payment error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}
}