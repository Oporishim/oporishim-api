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

@Controller('contacts/labels')
export class LabelsController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.CONTACT_SERVICE)
    private readonly contactServiceClient: ClientProxy,
  ) {}

  @Post()
  async create(
    @Body() body: { name: string; description?: string },
    @Res() res: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'labels/create' }, body),
      );

      return success(
        res,
        'Label has been created successfully!',
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
    @Query() query: { skip: number; limit: number },
    @Res() res: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'labels/findAll' }, query),
      );

      return success(
        res,
        'All labels fetched successfully!',
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
        this.contactServiceClient.send({ cmd: 'labels/findOne' }, { id: +id }),
      );

      return success(
        res,
        'Label has been fetched successfully!',
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
          { cmd: 'labels/update' },
          { id: Number(id), ...body },
        ),
      );
      return success(
        res,
        'Label has been updated successfully!',
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
        this.contactServiceClient.send({ cmd: 'labels/remove' }, { id: +id }),
      );

      return success(
        res,
        'Label has been deleted successfully!',
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
