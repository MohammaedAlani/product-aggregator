import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductFilterDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { filters: ProductFilterDto }) {
    const { filters } = params;
    const where: any = {
      ...(filters.name && {
        name: { contains: filters.name, mode: 'insensitive' },
      }),
      ...(filters.minPrice && { price: { gte: Number(filters.minPrice) } }),
      ...(filters.maxPrice && { price: { lte: Number(filters.maxPrice) } }),
      ...(filters.availability !== undefined && {
        availability: filters.availability,
      }),
      ...(filters.provider && { provider: filters.provider }),
    };

    // Convert to numbers and provide defaults
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { priceHistory: true },
      }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.product.findFirstOrThrow({
      where: { id },
      include: { priceHistory: true },
    });
  }

  async getRecentChanges(timeframe: number = 3600000) {
    // default 1 hour
    const date = new Date(Date.now() - timeframe);

    return this.prisma.product.findMany({
      where: {
        lastUpdated: {
          gte: date,
        },
      },
      include: {
        priceHistory: {
          where: {
            timestamp: {
              gte: date,
            },
          },
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });
  }
}
