import { Controller, Get, Post, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: string,
    @Query('method') method: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.paymentsService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      status,
      method,
      startDate,
      endDate,
    });
  }

  @Get('stats')
  async getStats() {
    return this.paymentsService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(Number(id));
  }

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.paymentsService.create(body, req.user.userId);
  }
}
