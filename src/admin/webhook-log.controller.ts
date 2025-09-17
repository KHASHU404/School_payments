// src/admin/webhook-logs.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebhookLog, WebhookLogDocument } from '../common/webhook-log.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/webhook-logs')
@UseGuards(AuthGuard('jwt'))
export class WebhookLogsController {
  constructor(@InjectModel(WebhookLog.name) private webhookLogModel: Model<WebhookLogDocument>) {}

  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('processed') processed?: string,
  ) {
    const p = Math.max(1, parseInt(String(page), 10) || 1);
    const l = Math.min(parseInt(String(limit), 10) || 20, 200);
    const skip = (p - 1) * l;

    const query: any = {};
    if (processed === 'true') query.processed = true;
    if (processed === 'false') query.processed = false;

    const [data, total] = await Promise.all([
      this.webhookLogModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(l).lean().exec(),
      this.webhookLogModel.countDocuments(query).exec(),
    ]);

    return { data, total, page: p, limit: l };
  }
}
