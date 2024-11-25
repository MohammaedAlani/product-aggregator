import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProvidersModule } from './providers/providers.module';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma.service';
import { AggregatorService } from './aggregator/aggregator.service';
import { AuthModule } from './auth/auth.module';
import { ApiKeyGuard } from './auth/auth.guard';

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
    AuthModule,
    ProvidersModule,
    ProductsModule,
  ],
  providers: [
    PrismaService,
    AggregatorService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
