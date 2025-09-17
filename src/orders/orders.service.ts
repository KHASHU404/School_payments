// src/orders/orders.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';

interface FindAllOptions {
  page: number;
  limit: number;
  status?: string;
  gateway?: string;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name); // Add Logger

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    this.logger.log('Creating a new order');
    this.logger.debug(`Order details: ${JSON.stringify(createOrderDto)}`);

    const created = new this.orderModel(createOrderDto);
    return created.save();
  }

  async findAll(options: FindAllOptions) {
    const { page, limit, status, gateway } = options;

    // Build the filter
    const filter: any = {};
    if (status) filter.payment_status = status;
    if (gateway) filter.gateway_name = gateway;

    const total = await this.orderModel.countDocuments(filter);

    const data = await this.orderModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { data, total, page, limit };
  }

  async findById(id: string) {
    this.logger.log(`Fetching order with ID: ${id}`);
    if (!Types.ObjectId.isValid(id)) {
      this.logger.warn(`Invalid order ID: ${id}`);
      return null;
    }
    return this.orderModel.findById(id).exec();
  }

  async payOrder(orderId: string, payDto: PayOrderDto): Promise<Order> {
    this.logger.log(`Paying order ${orderId}`);
    this.logger.debug(`Payment details: ${JSON.stringify(payDto)}`);

    const order = await this.orderModel.findById(orderId).exec();
    if (!order) {
      this.logger.error(`Order ${orderId} not found`);
      throw new NotFoundException('Order not found');
    }

    order.payment_status = payDto.status;
    order.transaction_id = payDto.transaction_id;
    this.logger.log(`Order ${orderId} updated with payment status ${payDto.status}`);
    return order.save();
  }
}
