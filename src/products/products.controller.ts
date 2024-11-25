import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductFilterDto } from './dto/product.dto';
import { CustomThrottlerGuard } from '../common/guards/throttle.guard';
import { ApiKeyGuard } from '../auth/auth.guard';
@ApiTags('products')
@Controller('products')
@UseGuards(ApiKeyGuard, CustomThrottlerGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  async getProducts(@Query() filters: ProductFilterDto) {
    return this.productsService.findAll({ filters });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID with price history' })
  async getProduct(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('changes/recent')
  @ApiOperation({ summary: 'Get recent product changes' })
  async getRecentChanges(@Query('timeframe') timeframe?: number) {
    return this.productsService.getRecentChanges(timeframe);
  }
}
