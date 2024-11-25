import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsSSEController {
  constructor(private readonly productsService: ProductsService) {}

  @Sse('sse')
  async sse(): Promise<Observable<Promise<MessageEvent>>> {
    return interval(5000).pipe(
      map(async () => {
        const products = await this.productsService.findAll({
          filters: { page: 1, limit: 10 },
        });

        return {
          data: JSON.stringify(products),
          type: 'message',
          id: new Date().getTime().toString(),
          retry: 5000,
        } as MessageEvent;
      }),
    );
  }
}
