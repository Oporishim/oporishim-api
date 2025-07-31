import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new GlobalExceptionsFilter()); // Apply validation filter
  await app.listen(process.env.PORT ?? 4000);

  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('API gateway is running on port 4000');
}
void bootstrap();
