import { Injectable } from '@nestjs/common';
import { ProductData } from './provider.interface';

interface Provider3Product {
  sku: string; // instead of id
  title: string; // instead of name
  details: {
    // nested object for product details
    shortDescription: string; // instead of description
    specifications: string[];
    category: string;
  };
  marketData: {
    // nested object for price data
    basePrice: number; // instead of price
    monetaryUnit: string; // instead of currency
    stockStatus: string; // instead of availability (with different values)
  };
  metadata: {
    // nested metadata
    lastModified: string; // instead of lastUpdated
    supplierCode: string;
  };
}

@Injectable()
export class Provider3Service {
  private products: Provider3Product[] = [
    {
      sku: 'COURSE-001',
      title: 'Advanced Machine Learning',
      details: {
        shortDescription: 'Comprehensive ML course',
        specifications: ['Video content', '12 weeks', 'Certificate'],
        category: 'Technology',
      },
      marketData: {
        basePrice: 499.99,
        monetaryUnit: 'EUR',
        stockStatus: 'IN_STOCK',
      },
      metadata: {
        lastModified: new Date().toISOString(),
        supplierCode: 'TECH_EDU',
      },
    },
    {
      sku: 'LICENSE-002',
      title: 'Enterprise Software License',
      details: {
        shortDescription: 'Annual enterprise license',
        specifications: ['Multiple users', 'Premium support', '24/7 access'],
        category: 'Software',
      },
      marketData: {
        basePrice: 1999.99,
        monetaryUnit: 'EUR',
        stockStatus: 'LIMITED',
      },
      metadata: {
        lastModified: new Date().toISOString(),
        supplierCode: 'SOFT_LIC',
      },
    },
  ];

  async getProducts(): Promise<ProductData[]> {
    // Simulate random price changes
    this.products = this.products.map((p) => ({
      ...p,
      marketData: {
        ...p.marketData,
        basePrice: p.marketData.basePrice * (0.9 + Math.random() * 0.2),
        stockStatus: Math.random() > 0.3 ? 'IN_STOCK' : 'OUT_OF_STOCK',
      },
      metadata: {
        ...p.metadata,
        lastModified: new Date().toISOString(),
      },
    }));

    // Normalize the data to match ProductData interface
    return this.products.map((p) => ({
      id: p.sku,
      name: p.title,
      description: p.details.shortDescription,
      price: p.marketData.basePrice,
      currency: p.marketData.monetaryUnit,
      availability: p.marketData.stockStatus === 'IN_STOCK',
      lastUpdated: new Date(p.metadata.lastModified),
      provider: 'provider3',
    }));
  }
}
