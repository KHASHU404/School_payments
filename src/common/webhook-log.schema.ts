// src/common/schemas/webhook-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WebhookLogDocument = WebhookLog & Document;

@Schema({ timestamps: true })
export class WebhookLog {
  @Prop({ type: Object, required: true })
  payload: Record<string, any>;

  @Prop({ default: false })
  processed: boolean;

  @Prop()
  process_error?: string;

  @Prop({ type: String })
  source?: string; // optional: "payment_provider" etc.
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);

// index to speed queries by processed + createdAt
WebhookLogSchema.index({ processed: 1, createdAt: -1 });
