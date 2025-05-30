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
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { success } from 'src/helpers/response.helper';

interface ServiceError {
  statusCode?: number;
  message?: string;
  [key: string]: unknown;
}

@Controller('todos')
export class TodosController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.CONTACT_SERVICE)
    private readonly contactServiceClient: ClientProxy,
  ) {}

  @Post()
  async create(
    @Body() body: { title: string; status: string },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'todo/create' }, body),
      );
      return success(
        resp,
        'Todo has been created successfully!',
        data,
        HttpStatus.OK,
      );
    } catch (error: unknown) {
      const serviceError = error as ServiceError;
      throw new HttpException(serviceError, serviceError?.statusCode ?? 400);
    }
  }

  @Get()
  async findAll(@Res() resp: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'todo/findAll' }, {}),
      );

      return success(resp, 'Todos fetched successfully!', data, HttpStatus.OK);
    } catch (error: unknown) {
      const serviceError = error as ServiceError;
      throw new HttpException(serviceError, serviceError?.statusCode ?? 400);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() resp: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'todo/findOne' }, id),
      );

      return success(resp, 'Todo fetched successfully!', data, HttpStatus.OK);
    } catch (error: unknown) {
      console.log(error);
      const serviceError = error as ServiceError;
      throw new HttpException(serviceError, serviceError?.statusCode ?? 400);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() resp: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'todo/remove' }, id),
      );
      return success(
        resp,
        'Todo has been deleted successfully!',
        data,
        HttpStatus.OK,
      );
    } catch (error: unknown) {
      console.log(error);
      const serviceError = error as ServiceError;
      throw new HttpException(serviceError, serviceError?.statusCode ?? 400);
    }
  }
}
