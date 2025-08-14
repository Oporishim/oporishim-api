import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from './filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionsFilter()); // Apply validation filter

  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}:${port}`);
}
void bootstrap();
