import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { AuthGuard, RequestWithUser } from 'src/guards/auth/auth.guard';
import { success } from 'src/helpers/response.helper';
import { ServiceErrorInterface } from 'src/interfaces/response.interface';

@Controller('contacts/peoples')
export class PeoplesController {
  private options: Record<string, any>;

  constructor(
    @Inject(MICROSERVICES_CLIENTS.CONTACT_SERVICE)
    private readonly contactServiceClient: ClientProxy,
  ) {
    this.options = { businessId: 1, appId: 1 };
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() body: { name: string; email: string; phone: string },
    @Req() req: RequestWithUser,
    @Res() resp: Response,
  ) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'peoples/create' },
          {
            ...body,
            userId: req.user.userId,
            appId: req.user.appId,
            subscriberId: req.user.subscriberId,
          },
        ),
      );

      return success(
        resp,
        'People has been created successfully!',
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

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query() query: { skip: number; limit: number },
    @Req() req: RequestWithUser,
    @Res() resp: Response,
  ) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'peoples/findAll' },
          {
            ...query,
            userId: req.user.userId,
            appId: req.user.appId,
            subscriberId: req.user.subscriberId,
          },
        ),
      );

      return success(
        resp,
        'All peoples fetched successfully!',
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

  @Get('/deleted')
  async deletedAll(
    @Query() query: { page: number; limit: number },
    @Res() res: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'individual/deleted' },
          {
            ...query,
            ...this.options,
          },
        ),
      );

      return success(
        res,
        'All deleted peoples fetched successfully!',
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

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() resp: Response,
  ) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'peoples/findOne' },
          {
            id,
            userId: req.user.userId,
            appId: req.user.appId,
            subscriberId: req.user.subscriberId,
          },
        ),
      );

      return success(resp, 'People fetched successfully!', data, HttpStatus.OK);
    } catch (error: unknown) {
      const serviceError = error as ServiceErrorInterface;
      throw new HttpException(
        serviceError,
        serviceError?.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { firstName: string; lastName: string },
    @Req() req: RequestWithUser,
    @Res() resp: Response,
  ) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'peoples/update' },
          {
            ...body,
            id: Number(id),
            userId: req.user.userId,
            appId: req.user.appId,
            subscriberId: req.user.subscriberId,
          },
        ),
      );

      return success(resp, 'People updated successfully!', data, HttpStatus.OK);
    } catch (error: unknown) {
      const serviceError = error as ServiceErrorInterface;
      throw new HttpException(
        serviceError,
        serviceError?.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() resp: Response,
  ) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'peoples/remove' },
          {
            id,
            userId: req.user.userId,
            appId: req.user.appId,
            subscriberId: req.user.subscriberId,
          },
        ),
      );

      return success(
        resp,
        'People has been deleted temporarily!',
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
