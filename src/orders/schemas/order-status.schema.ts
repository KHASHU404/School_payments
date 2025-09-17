// src/orders/schemas/order-status.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderStatusDocument = OrderStatus & Document;

@Schema({ timestamps: true })
export class OrderStatus {
  @Prop({ type: Types.ObjectId, ref: 'Order' })
  collect_id?: Types.ObjectId;

  @Prop()
  raw_collect_id?: string;

  @Prop()
  order_amount?: number;

  @Prop()
  transaction_amount?: number;

  @Prop()
  transaction_id?: string;

  @Prop()
  payment_mode?: string;

  @Prop()
  payment_details?: string;

  @Prop()
  bank_reference?: string;

  @Prop()
  payment_message?: string;

  @Prop()
  status?: string;

  @Prop()
  error_message?: string;

  @Prop()
  payment_time?: Date;

  @Prop({ type: Object })
  raw_payload?: Record<string, any>;
}

export const OrderStatusSchema = SchemaFactory.createForClass(OrderStatus);

// Indexes
OrderStatusSchema.index({ collect_id: 1 });
OrderStatusSchema.index({ transaction_id: 1 });
OrderStatusSchema.index({ payment_time: -1 });
