import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}
  create(createTableDto: Prisma.TableCreateInput) {
    const newTable = this.prisma.table.create({
      data: createTableDto,
    });
    return newTable;
  }

  findAll(tenantId: string) {
    return this.prisma.table.findMany({
      where: {
        tenantId: tenantId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.table.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateTableDto: Prisma.TableUpdateInput) {
    return this.prisma.table.update({
      where: {
        id,
      },
      data: updateTableDto,
    });
  }

  remove(id: string) {
    return `This action removes a #${id} table`;
  }
}
