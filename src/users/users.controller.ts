import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.ACCOUNT_SERVICE)
    private readonly accountServiceClient: ClientProxy,
  ) {}

  @Post()
  createUser(@Body() user: unknown) {
    return this.accountServiceClient.send({ cmd: 'users/create' }, user);
  }

  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.accountServiceClient.send({ cmd: 'users/findOne' }, +id);
  }
}
