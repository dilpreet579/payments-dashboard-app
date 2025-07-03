import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(query: {
    page: number;
    limit: number;
    status?: string;
    method?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { page, limit, status, method, startDate, endDate } = query;
    const where: any = {};
    if (status) where.status = status;
    if (method) where.method = method;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);
    return {
      data,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async create(body: any, userId: number) {
    const { amount, receiver, status, method } = body;
    return this.prisma.payment.create({
      data: {
        amount: Number(amount),
        receiver,
        status,
        method,
        userId,
      },
    });
  }

  async getStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const [
      totalToday,
      totalWeek,
      totalRevenue,
      failedCount,
      last7Days,
    ] = await Promise.all([
      this.prisma.payment.count({ where: { createdAt: { gte: startOfToday } } }),
      this.prisma.payment.count({ where: { createdAt: { gte: startOfWeek } } }),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
      this.prisma.payment.count({ where: { status: 'failed' } }),
      this.getLast7DaysRevenue(),
    ]);
    return {
      totalToday,
      totalWeek,
      totalRevenue: totalRevenue._sum.amount || 0,
      failedCount,
      last7Days,
    };
  }

  async getLast7DaysRevenue() {
    const result: { date: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      const revenue = await this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          createdAt: {
            gte: day,
            lt: nextDay,
          },
        },
      });
      result.push({
        date: day.toISOString().slice(0, 10),
        revenue: revenue._sum.amount || 0,
      });
    }
    return result;
  }
}
