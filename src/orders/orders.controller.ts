import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';


@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post(':id/pay')
  async payOrder(@Param('id') id: string, @Body() payOrderDto: PayOrderDto) {
    return this.ordersService.payOrder(id, payOrderDto);
  }


 @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('status') status?: string,
    @Query('gateway') gateway?: string,
  ) {
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    return this.ordersService.findAll({
      page: pageNumber,
      limit: pageLimit,
      status,
      gateway,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }
}
