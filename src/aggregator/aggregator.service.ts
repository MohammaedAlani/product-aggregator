import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Provider1Service } from '../providers/provider1.service';
import { Provider2Service } from '../providers/provider2.service';
import { Provider3Service } from '../providers/provider3.service';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { ProductData } from '../providers/provider.interface';

@Injectable()
export class AggregatorService implements OnModuleInit {
  private readonly logger = new Logger(AggregatorService.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;
  private isAggregating = false;

  constructor(
    private prisma: PrismaService,
    private provider1: Provider1Service,
    private provider2: Provider2Service,
    private provider3: Provider3Service,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.aggregateData();
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
      const [provider1Data, provider2Data, provider3Data] = await Promise.all([
        this.fetchWithRetry('provider1', () => this.provider1.getProducts()),
        this.fetchWithRetry('provider2', () => this.provider2.getProducts()),
        this.fetchWithRetry('provider3', () => this.provider3.getProducts()),
      ]);

      const timestamp = new Date();

      // Process each provider's data
      const allData = [
        ...provider1Data.map((data) => ({ ...data, provider: 'provider1' })),
        ...provider2Data.map((data) => ({ ...data, provider: 'provider2' })),
        ...provider3Data.map((data) => ({ ...data, provider: 'provider3' })),
      ];

      for (const data of allData) {
        try {
          await this.prisma.product.upsert({
            where: { id: data.id },
            create: {
              ...data,
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
      const staleThreshold = new Date(timestamp.getTime() - 5 * 60 * 1000);
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

  private async fetchWithRetry(
    providerName: string,
    fetchFn: () => Promise<ProductData[]>,
  ): Promise<ProductData[]> {
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const data = await fetchFn();
        this.logger.log(`Successfully fetched data from ${providerName}`);
        return data;
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
          setTimeout(resolve, this.retryDelay * Math.pow(2, attempt - 1)),
        );
      }
    }
    return [];
  }
}
