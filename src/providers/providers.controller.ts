// src/providers/providers.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Provider1Service } from './provider1.service';
import { Provider2Service } from './provider2.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('providers')
@Controller('providers')
export class ProvidersController {
  constructor(
    private readonly provider1Service: Provider1Service,
    private readonly provider2Service: Provider2Service,
  ) {}

  @Get('provider1/products')
  async getProvider1Products() {
    return this.provider1Service.getProducts();
  }

  @Get('provider2/products')
  async getProvider2Products() {
    return this.provider2Service.getProducts();
  }
}
