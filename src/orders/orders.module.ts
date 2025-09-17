// src/orders/orders.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderStatus, OrderStatusSchema } from './schemas/order-status.schema';
import { OrderStatusService } from './order-status.service';
import { WebhookController } from './webhook.controller';
import { WebhookLog, WebhookLogSchema } from 'src/common/webhook-log.schema'; // <- added
import { WebhookLogsController } from 'src/admin/webhook-log.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatus.name, schema: OrderStatusSchema },
      { name: WebhookLog.name, schema: WebhookLogSchema }, // <- register model
    ]),
  ],
  controllers: [OrdersController, WebhookController, WebhookLogsController],
  providers: [OrdersService, OrderStatusService],
  exports: [OrdersService, OrderStatusService],
})
export class OrdersModule {}
