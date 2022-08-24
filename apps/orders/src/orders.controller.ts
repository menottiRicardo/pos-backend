import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrder: Prisma.OrderCreateInput) {
    return this.ordersService.create(createOrder);
  }

  @Get('tenantId=:tenantId')
  findAll(@Param('tenantId') tenantId: string) {
    return this.ordersService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTable: Prisma.OrderCreateInput,
  ) {
    return this.ordersService.update(id, updateTable);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
