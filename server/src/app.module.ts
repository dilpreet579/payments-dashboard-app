import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [AuthModule, PaymentsModule],
  controllers: [AppController],
  providers: [AppService, PrismaClient],
})
export class AppModule {}
