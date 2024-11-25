import { Module } from '@nestjs/common';
import { Provider1Service } from './provider1.service';
import { Provider2Service } from './provider2.service';
import { Provider3Service } from './provider3.service';

@Module({
  providers: [Provider1Service, Provider2Service, Provider3Service],
  exports: [Provider1Service, Provider2Service, Provider3Service],
})
export class ProvidersModule {}
