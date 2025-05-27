import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';

interface ServiceError {
  statusCode?: number;
  message?: string;
  [key: string]: unknown;
}

@Controller('accounts')
export class AccountsController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.ACCOUNT_SERVICE)
    private readonly accountServiceClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() business: unknown) {
    return this.accountServiceClient
      .send({ cmd: 'businesses/create' }, business)
      .pipe(
        catchError((error: any) => {
          throw new HttpException(error as Record<string, any>, 400);
        }),
      );
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const response = await firstValueFrom<Response>(
        this.accountServiceClient.send({ cmd: 'auth/login' }, body),
      );

      return response;
    } catch (error: unknown) {
      const serviceError = error as ServiceError;
      throw new HttpException(serviceError, serviceError?.statusCode ?? 400);
    }
  }
}
