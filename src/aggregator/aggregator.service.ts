import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Provider1Service } from '../providers/provider1.service';
import { Provider2Service } from '../providers/provider2.service';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { ProductData } from '../providers/provider.interface';

@Injectable()
export class AggregatorService implements OnModuleInit {
  private readonly logger = new Logger(AggregatorService.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second
  private isAggregating = false;

  constructor(
    private prisma: PrismaService,
    private provider1: Provider1Service,
    private provider2: Provider2Service,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.aggregateData();
  }

  private async fetchWithRetry(
    providerName: string,
    fetchFn: () => Promise<ProductData[]>,
  ): Promise<ProductData[]> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fetchFn();
      } catch (error) {
        this.logger.error(
          `Attempt ${attempt}/${this.maxRetries} failed for ${providerName}:`,
          error.message,
        );

        if (attempt === this.maxRetries) {
          this.logger.error(`All attempts failed for ${providerName}`);
          return [];
        }

        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * attempt),
        );
      }
    }
    return [];
  }

  @Cron('*/5 * * * * *') // Run every 5 seconds
  async aggregateData() {
    if (this.isAggregating) {
      return;
    }

    try {
      this.isAggregating = true;
      this.logger.log('Starting data aggregation');

      // Fetch data from all providers concurrently with retry logic
      const [provider1Data, provider2Data] = await Promise.all([
        this.fetchWithRetry('provider1', () => this.provider1.getProducts()),
        this.fetchWithRetry('provider2', () => this.provider2.getProducts()),
      ]);

      const timestamp = new Date();

      // Process each provider's data
      for (const data of [...provider1Data, ...provider2Data]) {
        try {
          await this.prisma.product.upsert({
            where: { id: data.id },
            create: {
              ...data,
              provider: data.id.startsWith('1') ? 'provider1' : 'provider2',
              priceHistory: {
                create: {
                  price: data.price,
                  currency: data.currency,
                },
              },
            },
            update: {
              price: data.price,
              availability: data.availability,
              lastUpdated: data.lastUpdated,
              priceHistory: {
                create: {
                  price: data.price,
                  currency: data.currency,
                },
              },
            },
          });
        } catch (error) {
          this.logger.error(
            `Failed to upsert product ${data.id}:`,
            error.message,
          );
        }
      }

      // Mark stale data
      const staleThreshold = new Date(timestamp.getTime() - 5 * 60 * 1000); // 5 minutes
      await this.prisma.product.updateMany({
        where: {
          lastUpdated: {
            lt: staleThreshold,
          },
        },
        data: {
          availability: false,
        },
      });

      this.logger.log('Data aggregation completed successfully');
    } catch (error) {
      this.logger.error('Failed to aggregate data:', error.message);
    } finally {
      this.isAggregating = false;
    }
  }
}
