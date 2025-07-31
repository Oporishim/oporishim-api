import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';
import { UsersController } from './users/users.controller';
import { AccountsController } from './accounts/accounts.controller';
import { TodosController } from './todos/todos.controller';
import { ContactsController } from './contacts/contacts.controller';
import { BusinessesController } from './contacts/businesses/businesses.controller';
import { PeoplesController } from './contacts/peoples/peoples.controller';
import { LabelsController } from './contacts/labels/labels.controller';
import { RemindersController } from './contacts/reminders/reminders.controller';
import { PackagesController } from './settings/packages/packages.controller';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICES_CLIENTS.AUTH_SERVICE,
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
      {
        name: MICROSERVICES_CLIENTS.ACCOUNT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4003,
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    UsersController,
    AccountsController,
    TodosController,
    ContactsController,
    BusinessesController,
    PeoplesController,
    LabelsController,
    RemindersController,
    AuthController,
    PackagesController,
  ],
  providers: [AppService],
})
export class AppModule {}
