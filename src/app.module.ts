import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProvidersModule } from './providers/providers.module';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma.service';
import { AggregatorService } from './aggregator/aggregator.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    ProvidersModule,
    ProductsModule,
  ],
  providers: [PrismaService, AggregatorService],
})
export class AppModule {}
