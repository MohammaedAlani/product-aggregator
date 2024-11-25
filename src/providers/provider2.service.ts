import { Injectable } from '@nestjs/common';
import { ProductData } from './provider.interface';

interface Provider2Product {
  productId: string;
  productName: string;
  productInfo: string;
  currentPrice: number;
  currencyCode: string;
  inStock: boolean;
  updateTimestamp: string;
}

@Injectable()
export class Provider2Service {
  private products: Provider2Product[] = [
    {
      productId: '2',
      productName: 'Software License X',
      productInfo: 'Enterprise software license',
      currentPrice: 299.99,
      currencyCode: 'USD',
      inStock: true,
      updateTimestamp: new Date().toISOString(),
    },
  ];

  async getProducts(): Promise<ProductData[]> {
    // Simulate price and availability changes
    this.products = this.products.map((p) => ({
      ...p,
      currentPrice: p.currentPrice * (0.9 + Math.random() * 0.2),
      inStock: Math.random() > 0.1,
      updateTimestamp: new Date().toISOString(),
    }));

    // Normalize data to match ProductData interface
    return this.products.map((p) => ({
      id: p.productId,
      name: p.productName,
      description: p.productInfo,
      price: p.currentPrice,
      currency: p.currencyCode,
      availability: p.inStock,
      lastUpdated: new Date(p.updateTimestamp),
    }));
  }
}
