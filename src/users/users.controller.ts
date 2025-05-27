import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { AuthGuard, RequestWithUser } from 'src/guards/auth.guard';

interface UserResponse {
  id: number;
  email: string;
  name: string;
}

@Controller('users')
export class UsersController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.ACCOUNT_SERVICE)
    private readonly accountServiceClient: ClientProxy,
  ) {}

  @Post()
  createUser(@Body() user: unknown) {
    return this.accountServiceClient.send({ cmd: 'users/create' }, user).pipe(
      catchError((error: any) => {
        throw new HttpException(error as Record<string, any>, 400);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getUserProfile(@Req() req: RequestWithUser): Promise<UserResponse> {
    if (!req.user?.userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const user = this.accountServiceClient.send<UserResponse>(
      { cmd: 'users/findOne' },
      +req.user.userId,
    );

    return await firstValueFrom(user);
  }

  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.accountServiceClient.send({ cmd: 'users/findOne' }, +id);
  }
}
