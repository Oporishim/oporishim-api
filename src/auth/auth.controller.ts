import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import {
  RefreshAuthGuard,
  RequestWithUser,
} from 'src/guards/refresh-auth/refresh-auth.guard';
import { success } from 'src/helpers/response.helper';
import { ServiceErrorInterface } from 'src/interfaces/response.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.ACCOUNT_SERVICE)
    private readonly authServiceClient: ClientProxy,
  ) {}

  @Post('/signup')
  async signup(
    @Body()
    body: {
      name: string;
      email: string;
      phone: string;
      password: string;
      properties: any;
    },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.authServiceClient.send({ cmd: 'user/create' }, body),
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

  @Post('/signin')
  async signin(
    @Body() body: { email: string; password: string },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.authServiceClient.send({ cmd: 'auth/signin' }, body),
      );

      return success(resp, 'You are now signed in', data, HttpStatus.OK);
    } catch (error: unknown) {
      const serviceError = error as ServiceErrorInterface;
      throw new HttpException(
        serviceError,
        serviceError?.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post('/signout')
  async signout(@Req() req: RequestWithUser, @Res() resp: Response) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      console.log(req.user);

      const data = await firstValueFrom<Response>(
        this.authServiceClient.send({ cmd: 'auth/signout' }, +req.user.userId),
      );

      return success(resp, 'You are now signed out', data, HttpStatus.OK);
    } catch (error: unknown) {
      const serviceError = error as ServiceErrorInterface;
      throw new HttpException(
        serviceError,
        serviceError?.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@Req() req: RequestWithUser, @Res() resp: Response) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.authServiceClient.send(
          { cmd: 'auth/refresh-token' },
          +req.user.userId,
        ),
      );

      return success(
        resp,
        'Access token has been refreshed',
        data,
        HttpStatus.OK,
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
