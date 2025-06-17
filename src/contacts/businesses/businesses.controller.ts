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
  Query,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { success } from 'src/helpers/response.helper';
import { ServiceErrorInterface } from 'src/interfaces/response.interface';

@Controller('contacts/businesses')
export class BusinessesController {
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
        this.contactServiceClient.send({ cmd: 'businesses/create' }, body),
      );
      return success(
        resp,
        'Business has been created successfully!',
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
    @Res() res: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'businesses/findAll' }, query),
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

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/findOne' },
          { id: +id },
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

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/remove' },
          { id: +id },
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
}
