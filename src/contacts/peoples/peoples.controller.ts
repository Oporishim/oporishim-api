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
  private options: Record<string, any>;

  constructor(
    @Inject(MICROSERVICES_CLIENTS.CONTACT_SERVICE)
    private readonly contactServiceClient: ClientProxy,
  ) {
    this.options = { businessId: 1, appId: 1 };
  }

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
        this.contactServiceClient.send(
          { cmd: 'individual/findAll' },
          {
            ...query,
            ...this.options,
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

  @Get(':id')
  async findOne(@Res() resp: Response, @Param('id') id: string) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'individual/findOne' },
          { id, ...this.options },
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

  // Delate one or many
  @Delete(':id')
  async temporarilyDeleteOne(@Param('id') id: string, @Res() resp: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'individual/temporarilyDeleteOne' },
          { id, ...this.options },
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

  @Delete('/permanently/:id')
  async permanentlyDeleteOne(@Param('id') id: string, @Res() resp: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'individual/permanentlyDeleteOne' },
          { id, ...this.options },
        ),
      );

      return success(
        resp,
        'People has been deleted permanently!',
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

  @Post('/temporarilyDeleteAll')
  async temporarilyDeleteAll(
    @Body() body: { ids: number[] },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'individual/temporarilyDeleteAll' },
          body,
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

  @Post('/permanentlyDeleteAll')
  async permanentlyDeleteAll(
    @Body() body: { ids: number[] },
    @Res() resp: Response,
  ) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'individual/permanentlyDeleteAll' },
          body,
        ),
      );

      return success(
        resp,
        'Peoples has been deleted permanently!',
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

  // Recover one or many
  @Get('/recover/:id')
  async recoverOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'individual/recoverOne' },
          { id: +id, ...this.options },
        ),
      );

      return success(
        res,
        'People has been recovered successfully!',
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

  @Post('/recoverAll')
  async recoverMany(@Body() body: { ids: number[] }, @Res() res: Response) {
    try {
      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send({ cmd: 'individual/recoverAll' }, body),
      );

      return success(
        res,
        'Peoples has been recovered successfully!',
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
