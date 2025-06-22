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
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { success } from 'src/helpers/response.helper';
import { ServiceErrorInterface } from 'src/interfaces/response.interface';

@Controller('contacts/peoples')
export class PeoplesController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.CONTACT_SERVICE)
    private readonly contactServiceClient: ClientProxy,
  ) {}

  @Post()
  async create(
    @Body() body: { name: string; email: string; phone: string },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'individual/create' }, body),
      );
      return success(
        resp,
        'People has been created successfully!',
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

  @Get()
  async findAll(
    @Query() query: { skip: number; limit: number },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'individual/findAll' }, query),
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

  @Get(':id')
  async findOne(@Res() resp: Response, @Param('id') id: string) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'individual/findOne' }, { id }),
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { firstName: string; lastName: string },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'individual/update' },
          { id, body },
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

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() resp: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'individual/remove' }, { id }),
      );

      console.log(data);

      return success(resp, 'People deleted successfully!', data, HttpStatus.OK);
    } catch (error: unknown) {
      const serviceError = error as ServiceErrorInterface;
      throw new HttpException(
        serviceError,
        serviceError?.statusCode ?? HttpStatus.BAD_REQUEST,
      );
    }
  }
}
