import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security
  app.use(helmet());
  app.use(compression());
  app.enableCors();

  // Pipes and Filters
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Product Price Aggregator API')
    .setDescription(
      'API for aggregating product prices from multiple providers',
    )
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
        description: 'Enter your API key',
      },
      'x-api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Remove SSE endpoint from documentation if exists
  if (document.paths) {
    Object.keys(document.paths).forEach((path) => {
      if (path.includes('sse')) {
        delete document.paths[path];
      }
    });
  }

  SwaggerModule.setup('api', app, document);

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'src/public'));

  await app.listen(3000);
}
bootstrap();
