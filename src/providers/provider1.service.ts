import { Injectable } from '@nestjs/common';
import { ProductData } from './provider.interface';

@Injectable()
export class Provider1Service {
  private products: ProductData[] = [
    {
      id: '1',
      name: 'Digital Course A',
      description: 'Learn programming',
      price: 99.99,
      currency: 'USD',
      availability: true,
      lastUpdated: new Date(),
    },
  ];

  async getProducts(): Promise<ProductData[]> {
    this.products = this.products.map((p) => ({
      ...p,
      price: p.price * (0.9 + Math.random() * 0.2),
      lastUpdated: new Date(),
    }));

    return this.products;
  }
}
