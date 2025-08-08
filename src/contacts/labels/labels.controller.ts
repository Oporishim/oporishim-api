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

@Controller('contacts/labels')
export class LabelsController {
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
    @Body() body: { name: string; description?: string },
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'labels/create' },
          {
            ...body,
            appId: req.user.appId,
            userId: req.user.userId,
            subscriberId: req.user.subscriberId,
          },
        ),
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

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Query() query: { skip: number; limit: number; name?: string },
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'labels/findAll' },
          {
            ...query,
            appId: req.user.appId,
            userId: req.user.userId,
            subscriberId: req.user.subscriberId,
          },
        ),
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

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'labels/findOne' },
          {
            id,
            appId: req.user.appId,
            userId: req.user.userId,
            subscriberId: req.user.subscriberId,
          },
        ),
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

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name: string; description?: string },
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'labels/update' },
          {
            ...body,
            id: Number(id),
            appId: req.user.appId,
            userId: req.user.userId,
            subscriberId: req.user.subscriberId,
          },
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

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
    @Res() res: Response,
  ) {
    try {
      if (!req.user?.userId)
        throw new UnauthorizedException('User not authenticated');

      const data = await firstValueFrom<Response>(
        this.contactServiceClient.send(
          { cmd: 'labels/remove' },
          {
            id,
            appId: req.user.appId,
            userId: req.user.userId,
            subscriberId: req.user.subscriberId,
          },
        ),
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
