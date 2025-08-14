import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';
import { PeoplesController } from './contacts/peoples/peoples.controller';
import { LabelsController } from './contacts/labels/labels.controller';
import { PackagesController } from './settings/packages/packages.controller';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { BusinessesController } from './contacts/businesses/businesses.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsController } from './products/products.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: MICROSERVICES_CLIENTS.ACCOUNT_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('ACCOUNT_TCP_HOST'),
            port: config.get<number>('ACCOUNT_TCP_PORT'),
          },
        }),
      },
      {
        name: MICROSERVICES_CLIENTS.CONTACT_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: config.get<string>('CONTACT_TCP_HOST'),
            port: config.get<number>('CONTACT_TCP_HOST'),
          },
        }),
      },
      {
        name: MICROSERVICES_CLIENTS.PRODUCT_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('PRODUCT_RMQ_URL') as string],
            queue: config.get<string>('PRODUCT_RMQ_QUEUE') as string,
            queueOptions: { durable: false },
          },
        }),
      },
    ]),
  ],
  controllers: [
    AppController,
    PackagesController,
    AuthController,
    UsersController,
    LabelsController,
    PeoplesController,
    BusinessesController,
    ProductsController,
  ],
  providers: [AppService],
})
export class AppModule {}
