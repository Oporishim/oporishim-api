import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Res,
  Scope,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { success } from 'src/helpers/response.helper';
import { RequestWithUserInterface as RequestWithUser } from 'src/interfaces/request-with-user.interface';
import { ServiceErrorInterface } from 'src/interfaces/response.interface';

@UseGuards(AuthGuard)
@Controller({ path: 'products', scope: Scope.REQUEST })
export class ProductsController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.PRODUCT_SERVICE)
    private readonly productServiceClient: ClientProxy,
  ) {}

  @Post()
  async create(
    @Body() body: any,
    @User({ skip: ['role', 'subscriberId', 'appId'] }) user: RequestWithUser,
    @Res() resp: Response,
  ) {
    console.log(user);
    try {
      const data = await firstValueFrom<Response>(
        this.productServiceClient.send(
          { cmd: 'product/create' },
          { ...body, ...user },
        ),
      );
      return success(
        resp,
        'Product has been created successfully!',
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
