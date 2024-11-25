import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { PrismaService } from './prisma.service';
import { Provider1Service } from './providers/provider1.service';
import { Provider2Service } from './providers/provider2.service';
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
    }]),
    AuthModule,
    ProductsModule,
  ],
  providers: [
    PrismaService,
    Provider1Service,
    Provider2Service,
    AggregatorService,
  ],
})
export class AppModule {}
