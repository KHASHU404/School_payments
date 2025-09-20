// src/transactions/transactions.controller.ts
import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly svc: TransactionsService) {}

  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
    @Query('schoolId') schoolId?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    return this.svc.list({ page: +page, limit: +limit, status, schoolId, sort, order });
  }

  @Get('school/:schoolId')
  async bySchool(@Param('schoolId') schoolId: string, @Query('page') page = '1', @Query('limit') limit = '20') {
    return this.svc.listBySchool(schoolId, +page, +limit);
  }

  @Get('status/:custom_order_id')
  async status(@Param('custom_order_id') custom_order_id: string) {
    return this.svc.transactionStatusByCustomOrderId(custom_order_id);
  }

   @Get('school/:schoolId')
  async getTransactionsBySchool(
    @Param('schoolId') schoolId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.svc.listBySchool(schoolId, +page, +limit);
  }
}
