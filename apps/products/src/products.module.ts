import { Module } from '@nestjs/common';
import { PrismaService } from 'apps/orders/src/prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
