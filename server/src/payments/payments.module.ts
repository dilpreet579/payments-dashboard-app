import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaClient } from '@prisma/client';
import { PaymentsGateway } from './payments.gateway';

@Module({
  providers: [PaymentsService, PrismaClient, PaymentsGateway],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
