import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategory: Prisma.CategoryCreateInput) {
    return this.categoriesService.create(createCategory);
  }

  @Get('tenantId=:tenantId')
  findAll(@Param('tenantId') tenantId: string) {
    return this.categoriesService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategory: Prisma.CategoryUpdateInput,
  ) {
    return this.categoriesService.update(id, updateCategory);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
