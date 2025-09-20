// src/payments/payments.service.ts
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createCollect(dto: CreatePaymentDto) {
    const pgKey = this.configService.get<string>('PAYMENT_PG_KEY');
    const apiKey = this.configService.get<string>('PAYMENT_API_KEY');
    const baseUrl = this.configService.get<string>('PAYMENT_BASE_URL');
    const callback = dto.callback_url ?? this.configService.get<string>('PAYMENT_CALLBACK_URL');

    if (!pgKey || !apiKey || !baseUrl) {
      this.logger.error('Missing payment configuration (PAYMENT_PG_KEY/PAYMENT_API_KEY/PAYMENT_BASE_URL).');
      throw new InternalServerErrorException('Payment provider not configured');
    }

    // 1) Create a local Order record (required fields). student_info is required in your schema,
    // so use the provided student_info or a placeholder if not provided.
    const studentInfo = dto.student_info ?? { name: 'NA', id: `NA-${Date.now()}`, email: undefined };
    const initialCustomOrderId = dto.custom_order_id ?? `ORD-${Date.now()}`;

    const orderToCreate: Partial<Order> = {
      school_id: Types.ObjectId.isValid(dto.school_id) ? new Types.ObjectId(dto.school_id) : dto.school_id as any,
      student_info: studentInfo as any,
      gateway_name: dto.gateway_name ?? undefined,
      custom_order_id: initialCustomOrderId,
    };

    const createdOrder = await this.orderModel.create(orderToCreate as any);

    // 2) Create sign JWT using PG secret for provider
    const signPayload = { school_id: dto.school_id, amount: dto.amount, callback_url: callback };
    const sign = jwt.sign(signPayload, pgKey);
    

    const body = {
      school_id: dto.school_id,
      amount: dto.amount,
      callback_url: callback,
      sign,
    };

    try {
      // 3) Call provider
      const resp = await axios.post(`${baseUrl}/create-collect-request`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      });

      const data = resp.data;
      this.logger.debug('Provider response raw: ' + JSON.stringify(resp.data))

      // 4) Persist provider collect_request_id onto the Order (so webhook can find via custom_order_id)
      // 4) Persist provider collect_request_id onto the Order (so webhook can find via custom_order_id)
const providerCollectId = data?.collect_request_id ?? data?.collectRequestId ?? null;
if (providerCollectId) {
  // safer: update via findByIdAndUpdate (avoids calling .save() on non-doc objects)
  await this.orderModel.findByIdAndUpdate(
    createdOrder._id,
    { $set: { custom_order_id: providerCollectId } },
    { new: true }
  ).exec();

  // optional: reload createdOrder for return payload
  const refreshed = await this.orderModel.findById(createdOrder._id).exec();
  // use 'refreshed' if you want the saved copy in the returned order object
  return {
    provider: data,
    order: {
      _id: refreshed?._id ?? createdOrder._id,
      custom_order_id: refreshed?.custom_order_id ?? createdOrder.custom_order_id,
    },
  };
} else {
  this.logger.warn('Provider did not return collect_request_id; keeping local id');
  // return current createdOrder mapping
  return {
    provider: data,
    order: {
      _id: createdOrder._id,
      custom_order_id: createdOrder.custom_order_id,
    },
  };
}

    } catch (err: any) {
      this.logger.error('Payment provider error', err?.response?.data ?? err?.message);

      // optional: mark order as failed/removed or keep for later retry
      await this.orderModel.findByIdAndUpdate(createdOrder._id, { $set: { payment_status: 'provider_error' } }).exec();

      throw new InternalServerErrorException('Payment provider request failed');
    }
  }

  // inside PaymentsService class (replace existing createPayment)
  /**
   * High-level entry used by frontend: creates local order, calls provider,
   * and returns a consistent payload containing a redirect URL (if any).
   */
  // Replace existing createPayment with this implementation
async createPayment(dto: CreatePaymentDto) {
  try {
    this.logger.log(`Creating payment for school ${dto.school_id} amount ${dto.amount}`);

    // Call the full provider flow implemented in createCollect
    const result = await this.createCollect(dto);

    // normalize result
    const provider: any = result?.provider ?? {};
    const order: any = result?.order ?? {};

    // Try many possible places the provider might put a URL (defensive)
    const paymentUrl =
      provider?.Collect_request_url ||
      provider?.collect_request_url ||
      provider?.collectRequestUrl ||
      provider?.redirect_url ||
      provider?.payment_url ||
      provider?.url ||
      provider?.paymentUrl ||
      provider?.data?.Collect_request_url ||
      provider?.data?.collect_request_url ||
      null;

    const collectId =
      provider?.collect_request_id ||
      provider?.collectRequestId ||
      provider?.collect_requestid ||
      order?.custom_order_id ||
      order?._id ||
      null;

    // Helpful debug logging in dev
    this.logger.debug('Normalized createPayment result', {
      collectId,
      paymentUrl,
      providerPreview: provider ? (typeof provider === 'object' ? provider : String(provider)) : null,
      order,
    });

    return {
      success: true,
      collect_request_id: collectId,
      collect_request_url: paymentUrl,
      provider_raw: provider,
      order: order,
    };
  } catch (error: any) {
    // log and rethrow (controller will return 500)
    this.logger.error('Error in createPayment', error?.response?.data ?? error?.message ?? error);
    throw error;
  }
}

}
