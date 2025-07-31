import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { success } from 'src/helpers/response.helper';
import { ServiceErrorInterface } from 'src/interfaces/response.interface';

@Controller('auth')
export class AuthController {
  private options: Record<string, any>;

  constructor(
    @Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE)
    private readonly contactServiceClient: ClientProxy,
  ) {
    this.options = { businessId: 1, appId: 1 };
  }

  @Post('/signup')
  async signup(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      genus: string;
      properties: any;
    },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'user/create' },
          {
            ...body,
            ...this.options,
          },
        ),
      );
      return success(
        resp,
        'Signup has been completed',
        data,
        HttpStatus.CREATED,
      );
    } catch (error: unknown) {
      const serviceError = error as ServiceErrorInterface;
      throw new HttpException(
        serviceError,
        serviceError?.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }
}
