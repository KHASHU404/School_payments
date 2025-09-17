// src/orders/webhook.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { OrderStatusService } from './order-status.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookLog, WebhookLogDocument } from 'src/common/webhook-log.schema';


@Controller()
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly orderStatusService: OrderStatusService,
    @InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLogDocument>,
  ) {}

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    this.logger.log('Webhook received');

    // 1) persist the raw payload (unprocessed initially)
    const createdLog = await this.webhookLogModel.create({
      payload,
      processed: false,
      source: payload?.source ?? 'payment_provider',
    });

    try {
      // 2) process (upsert OrderStatus + update Order)
      const result = await this.orderStatusService.upsertFromWebhook(payload);

      // 3) mark log as processed
      await this.webhookLogModel.findByIdAndUpdate(createdLog._id, {
        $set: { processed: true, process_error: null },
      }).exec();

      return { ok: true, resultId: result?._id ?? null };
    } catch (err: any) {
      this.logger.error('Webhook processing error', err);
      // mark log with error message
      await this.webhookLogModel.findByIdAndUpdate(createdLog._id, {
        $set: { processed: false, process_error: (err?.message ?? String(err)).slice(0, 200) },
      }).exec();

      // rethrow so caller (test) can see failure, or you can return 200 to avoid retries
      throw err;
    }
  }
}
