// src/orders/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class StudentInfo {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  id: string;

  @Prop()
  email?: string;
}

export const StudentInfoSchema = SchemaFactory.createForClass(StudentInfo);

@Schema({ timestamps: true })
export class Order {
  // @Prop({ type: Types.ObjectId })
  // _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  school_id: Types.ObjectId | string;

  @Prop({ type: Types.ObjectId })
  trustee_id?: Types.ObjectId | string;

  @Prop({ type: StudentInfoSchema, required: true })
  student_info: StudentInfo;

  @Prop()
  gateway_name?: string;

  @Prop({ required: false })
  custom_order_id?: string;

  // optional fields used by webhook/status updates
  @Prop({ default: 'pending' })
  payment_status?: string;

  @Prop()
  transaction_id?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Explicit indexes — add only here, no duplicate "index: true" in @Prop
OrderSchema.index({ school_id: 1 });
OrderSchema.index({ custom_order_id: 1 }, { unique: true, sparse: true });
OrderSchema.index({ transaction_id: 1 });
