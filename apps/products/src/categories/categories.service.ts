import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'apps/orders/src/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  create(createProduct: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data: createProduct,
    });
  }

  findAll(tenantId: string) {
    return this.prisma.category.findMany({
      where: {
        tenantId: tenantId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, udpateCategory: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: {
        id,
      },
      data: udpateCategory,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} table`;
  }
}
