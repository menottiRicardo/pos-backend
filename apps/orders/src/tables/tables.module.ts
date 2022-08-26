import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from 'libs/common/src';

@Module({
  imports: [AuthModule],
  controllers: [TablesController],
  providers: [TablesService, PrismaService],
})
export class TablesModule {}
