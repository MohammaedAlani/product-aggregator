import { Controller, Sse } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsService } from './products.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('products')
export class ProductsSSEController {
  constructor(private readonly productsService: ProductsService) {}

  @Sse('sse')
  sse(): Observable<Promise<{ data: string; id: string; type: string }>> {
    return interval(5000).pipe(
      map(async () => {
        const products = await this.productsService.findAll({
          filters: { page: 1, limit: 10 },
        });

        return {
          data: JSON.stringify(products.data),
          type: 'message',
          id: new Date().getTime().toString(),
        };
      }),
    );
  }
}
