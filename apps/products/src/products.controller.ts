import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create Product' })
  create(@Body() createProduct: Prisma.ProductCreateInput) {
    return this.productsService.create(createProduct);
  }

  @Get('tenantId=:tenantId')
  findAll(@Param('tenantId') tenantId: string) {
    return this.productsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTable: Prisma.ProductUpdateInput,
  ) {
    return this.productsService.update(id, updateTable);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
