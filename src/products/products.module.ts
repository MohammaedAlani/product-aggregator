import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsSSEController } from './products-sse.controller';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [ProductsController, ProductsSSEController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}