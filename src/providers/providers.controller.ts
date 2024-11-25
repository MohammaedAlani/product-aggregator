// src/providers/providers.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Provider1Service } from './provider1.service';
import { Provider2Service } from './provider2.service';
import { Provider3Service } from './provider3.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(
    private readonly provider1Service: Provider1Service,
    private readonly provider2Service: Provider2Service,
    private readonly provider3Service: Provider3Service,
  ) {}

  @Get('provider1/products')
  async getProvider1Products() {
    return this.provider1Service.getProducts();
  }

  @Get('provider2/products')
  async getProvider2Products() {
    return this.provider2Service.getProducts();
  }

  @Get('provider3/products')
  async getProvider3Products() {
    return this.provider3Service.getProducts();
  }
}
