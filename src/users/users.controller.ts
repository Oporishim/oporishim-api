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
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RequestWithUserInterface as RequestWithUser } from 'src/interfaces/request-with-user.interface';

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
    return this.accountServiceClient.send({ cmd: 'user/create' }, user).pipe(
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
      { cmd: 'user/findOne' },
      +req.user.userId,
    );

    return await firstValueFrom(user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.accountServiceClient.send({ cmd: 'user/findOne' }, +id);
  }
}
