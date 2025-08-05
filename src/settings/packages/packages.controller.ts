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

@Controller('settings/packages')
export class PackagesController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.ACCOUNT_SERVICE)
    private readonly packageServiceClient: ClientProxy,
  ) {}

  @Post()
  async create(
    @Body() body: { name: string; description: string; properties: any },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.packageServiceClient.send({ cmd: 'package/create' }, body),
      );

      return success(
        resp,
        'Package has been created successfully!',
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
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.packageServiceClient.send({ cmd: 'package/findAll' }, query),
      );

      return success(
        resp,
        'All packages fetched successfully!',
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
  async findOne(@Param('id') id: string, @Res() resp: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.packageServiceClient.send({ cmd: 'package/findOne' }, { id }),
      );

      return success(
        resp,
        'Package fetched successfully!',
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name: string; description: string; properties: any },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.packageServiceClient.send(
          { cmd: 'package/update' },
          { id: Number(id), ...body },
        ),
      );

      return success(
        resp,
        'Package updated successfully!',
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
        this.packageServiceClient.send({ cmd: 'package/remove' }, { id: +id }),
      );

      return success(
        res,
        'Package has been deleted successfully!',
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
