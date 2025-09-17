// src/orders/order-status.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderStatus, OrderStatusDocument } from './schemas/order-status.schema';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrderStatusService {
  private readonly logger = new Logger(OrderStatusService.name);

  constructor(
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  /**
   * Upsert OrderStatus from webhook payload.
   * Expects payload format with order_info.order_id = "collect_id/transaction_id"
   */
// inside OrderStatusService class: replace the existing method with this
async upsertFromWebhook(payload: any) {
  this.logger.log('Received webhook payload');
  this.logger.debug(JSON.stringify(payload));

  const orderInfo = payload?.order_info;
  if (!orderInfo || !orderInfo.order_id) {
    throw new Error('Invalid webhook payload: missing order_info.order_id');
  }

  // collect_id may be "collectId/transactionId"
  const parts = String(orderInfo.order_id).split('/');
  const collectIdStr = parts[0];
  const transactionId = parts[1] ?? orderInfo.transaction_id ?? null;

  // determine if collectIdStr is an ObjectId
  let collectObjectId: Types.ObjectId | null = null;
  if (Types.ObjectId.isValid(collectIdStr)) {
    collectObjectId = new Types.ObjectId(collectIdStr);
  } else {
    collectObjectId = null;
    this.logger.warn(`collect_id (${collectIdStr}) is not a valid ObjectId. Will try fallback lookups.`);
  }

  // Build order status document (include transaction_id for dedupe / lookup)
  const statusDoc: Partial<OrderStatus> = {
    order_amount: orderInfo.order_amount ?? orderInfo.amount ?? 0,
    transaction_amount: orderInfo.transaction_amount ?? orderInfo.transaction_amount ?? 0,
    transaction_id: transactionId ?? undefined,
    payment_mode: orderInfo.payment_mode ?? orderInfo.paymentMode ?? orderInfo.payment_method,
    payment_details: orderInfo.payemnt_details ?? orderInfo.payment_details ?? orderInfo.paymentDetails,
    bank_reference: orderInfo.bank_reference ?? orderInfo.bankReference,
    payment_message: orderInfo.Payment_message ?? orderInfo.payment_message,
    status: orderInfo.status ?? payload?.status ?? 'unknown',
    error_message: orderInfo.error_message ?? orderInfo.errorMessage ?? null,
    payment_time: orderInfo.payment_time ? new Date(orderInfo.payment_time) : undefined,
    raw_payload: payload,
  };

  // Idempotency / duplicate check: if we have both collectObjectId and transactionId,
  // try to find an existing OrderStatus with same collect_id + transaction_id + status.
  if (collectObjectId && transactionId) {
    const existing = await this.orderStatusModel.findOne({
      collect_id: collectObjectId,
      $or: [
        { transaction_id: transactionId },
        { 'raw_payload.order_info.transaction_id': transactionId },
      ],
      status: statusDoc.status,
    }).exec();

    if (existing) {
      this.logger.log(`Duplicate webhook ignored for collect ${collectObjectId} txn ${transactionId}`);
      return existing;
    }
  }

  // Upsert by collect_id (when it's an ObjectId).
  let orderStatusDoc;
  if (collectObjectId) {
    orderStatusDoc = await this.orderStatusModel.findOneAndUpdate(
      { collect_id: collectObjectId },
      { $set: { ...statusDoc } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();

    // Update corresponding Order (if it exists)
    try {
      await this.orderModel.findByIdAndUpdate(
        collectObjectId,
        {
          $set: {
            payment_status: statusDoc.status,
            transaction_id: statusDoc.transaction_id ?? statusDoc.transaction_amount?.toString(),
            gateway_name: orderInfo.gateway ?? orderInfo.gateway_name,
          },
        },
        { new: true },
      ).exec();
    } catch (err) {
      // non-fatal: log and continue
      this.logger.warn(`Failed to update Order ${collectObjectId}: ${(err as Error).message}`);
    }
  } else {
    // fallback: try to find order by custom_order_id
    const order = await this.orderModel.findOne({ custom_order_id: collectIdStr }).exec();
    if (!order) {
      // no order found — create OrderStatus without collect_id but keep raw_collect_id
      orderStatusDoc = await this.orderStatusModel.create({
        ...statusDoc,
        raw_collect_id: collectIdStr,
      } as any);
    } else {
      orderStatusDoc = await this.orderStatusModel.findOneAndUpdate(
        { collect_id: order._id },
        { $set: { ...statusDoc } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).exec();

      try {
        await this.orderModel.findByIdAndUpdate(
          order._id,
          {
            $set: {
              payment_status: statusDoc.status,
              transaction_id: statusDoc.transaction_id ?? statusDoc.transaction_amount?.toString(),
              gateway_name: orderInfo.gateway ?? orderInfo.gateway_name,
            },
          },
          { new: true },
        ).exec();
      } catch (err) {
        this.logger.warn(`Failed to update Order ${order._id}: ${(err as Error).message}`);
      }
    }
  }

  this.logger.log('OrderStatus upsert completed');
  return orderStatusDoc;
}
}
