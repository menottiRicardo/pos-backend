import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'apps/orders/src/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  create(createProduct: Prisma.ProductCreateInput) {
    const newProduct = this.prisma.product.create({
      data: createProduct,
    });
    return newProduct;
  }

  findAll(tenantId: string) {
    return this.prisma.product.findMany({
      where: {
        tenantId: tenantId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateProduct: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: {
        id,
      },
      data: updateProduct,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} table`;
  }
}
