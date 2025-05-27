import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';
import { UsersController } from './users/users.controller';
import { AccountsController } from './accounts/accounts.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES_CLIENTS.ACCOUNT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4001,
        },
      },
      {
        name: MICROSERVICES_CLIENTS.CONTACT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4002,
        },
      },
    ]),
  ],
  controllers: [AppController, UsersController, AccountsController],
  providers: [AppService],
})
export class AppModule {}
