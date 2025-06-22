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

  @Get()
  async findAll(
    @Query()
    query: { skip: number; limit: number; businessId?: number; appId?: number },
    @Res() res: Response,
  ) {
    try {
      // Add business Id & App Id
      const conditions = {
        ...query,
        businessId: 1,
        appId: 1,
      };

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/findAll' },
          conditions,
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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name: string; description?: string },
    @Res() res: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/update' },
          { id: Number(id), ...body },
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

  @Get('/recover/:id')
  async recover(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'businesses/recover' },
          { id: +id },
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
