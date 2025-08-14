import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
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
@Controller({ path: 'contacts/businesses', scope: Scope.REQUEST })
export class BusinessesController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.CONTACT_SERVICE)
    private readonly contactServiceClient: ClientProxy,
  ) {}

  @Post()
  async create(
    @Body() body: any,
    @User({ skip: ['role'] }) user: RequestWithUser,
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/create' },
          { ...body, ...user },
        ),
      );
      return success(
        resp,
        'Business has been created successfully!',
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
    @Query()
    query: { skip: number; limit: number; businessId?: number; appId?: number },
    @Res() res: Response,
    @User({ skip: ['role'] }) user: RequestWithUser,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/findAll' },
          { ...query, ...user },
        ),
      );

      return success(
        res,
        'All businesses fetched successfully!',
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
    @Res() res: Response,
    @User({ skip: ['role'] }) user: RequestWithUser,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/findOne' },
          { id, ...user },
        ),
      );

      return success(
        res,
        'Business has been fetched successfully!',
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
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @User({ skip: ['role'] }) user: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/update' },
          { id: Number(id), ...body, ...user },
        ),
      );
      return success(
        res,
        'Business has been updated successfully!',
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
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @User({ skip: ['role'] }) user: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/remove' },
          { id, ...user },
        ),
      );

      return success(
        res,
        'Business has been deleted successfully!',
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
  @Get('/recover/:id')
  async recover(
    @Param('id') id: string,
    @User({ skip: ['role', 'userId', 'appId'] })
    user: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/recover' },
          { id: +id, ...user },
        ),
      );

      return success(
        res,
        'Business has been recovered successfully!',
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
