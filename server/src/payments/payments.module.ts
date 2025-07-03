import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [PaymentsService, PrismaClient],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
