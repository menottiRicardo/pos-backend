import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaService } from './prisma.service';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [TablesModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
})
export class OrdersModule {}
