import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaClient } from '@prisma/client';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, PaymentsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaClient],
})
export class AppModule {}
