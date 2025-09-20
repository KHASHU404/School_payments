// src/transactions/transactions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { OrderStatus, OrderStatusDocument } from '../orders/schemas/order-status.schema';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderStatus.name) private orderStatusModel: Model<OrderStatusDocument>,
  ) {}

  // Aggregated list with pagination, filtering, sorting
  async list(params: {
    page?: number;
    limit?: number;
    status?: string;
    schoolId?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const skip = (page - 1) * limit;

    const match: any = {};
    if (params.status) match['status'] = params.status;
    if (params.schoolId) match['school_id'] = params.schoolId; // will map after lookup

    // Aggregation from OrderStatus, join with orders collection
    const pipeline: any[] = [
      {
        $lookup: {
          from: this.orderModel.collection.name,
          localField: 'collect_id',
          foreignField: '_id',
          as: 'order',
        },
      },
      { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
    ];

    // If filtering by schoolId, filter using order.school_id
    if (params.schoolId) {
      pipeline.push({
        $match: { 'order.school_id': params.schoolId },
      });
    }

    if (params.status) {
      pipeline.push({
        $match: { status: params.status },
      });
    }

    // Project required fields
    pipeline.push({
      $project: {
        collect_id: '$collect_id',
        school_id: '$order.school_id',
        gateway: '$order.gateway_name',
        order_amount: '$order_amount',
        transaction_amount: '$transaction_amount',
        status: '$status',
        custom_order_id: '$order.custom_order_id',
        payment_time: '$payment_time',
      },
    });

    // Sorting
    const sortField = params.sort ?? 'payment_time';
    const sortOrder = params.order === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [sortField]: sortOrder } });

    // Facet for pagination
    pipeline.push(
      { $skip: skip },
      { $limit: limit },
    );

    const data = await this.orderStatusModel.aggregate(pipeline).exec();

    // total count (simpler: count documents matching filters)
    const countPipeline = [...pipeline];
    // Remove skip/limit/sort for count (we'll rebuild a simpler count pipeline)
    // For accuracy, do a separate count:
    const countMatchPipeline: any[] = [
      {
        $lookup: {
          from: this.orderModel.collection.name,
          localField: 'collect_id',
          foreignField: '_id',
          as: 'order',
        },
      },
      { $unwind: { path: '$order', preserveNullAndEmptyArrays: true } },
    ];
    if (params.schoolId) countMatchPipeline.push({ $match: { 'order.school_id': params.schoolId } });
    if (params.status) countMatchPipeline.push({ $match: { status: params.status } });
    countMatchPipeline.push({ $count: 'total' });

    const countResult = await this.orderStatusModel.aggregate(countMatchPipeline).exec();
    const total = (countResult[0] && countResult[0].total) || 0;

    return { data, total, page, limit };
  }

  async listBySchool(schoolId: string, page = 1, limit = 20) {
    return this.list({ page, limit, schoolId });
  }

  async transactionStatusByCustomOrderId(customOrderId: string) {
    // find order by custom_order_id, then find latest status
    const order = await this.orderModel.findOne({ custom_order_id: customOrderId }).exec();
    if (!order) return null;

    const status = await this.orderStatusModel
      .findOne({ collect_id: order._id })
      .sort({ payment_time: -1 })
      .lean()
      .exec();

    return { custom_order_id: customOrderId, status: status?.status ?? 'unknown', transaction_amount: status?.transaction_amount ?? null, payment_time: status?.payment_time ?? null };
  }


}
