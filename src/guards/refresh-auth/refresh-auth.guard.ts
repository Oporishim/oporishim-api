import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { AuthVerifyResponseInterface } from 'src/interfaces/auth-verify-response.interface';
import { RequestWithUserInterface as RequestWithUser } from 'src/interfaces/request-with-user.interface';

@Injectable()
export class RefreshAuthGuard implements CanActivate {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.ACCOUNT_SERVICE)
    private readonly authServiceClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const authHeader: string | undefined = request.headers
      ?.authorization as string;

    if (!authHeader) throw new UnauthorizedException('Missing refresh token!');

    const token = authHeader.split(' ')[1];
    const result = await firstValueFrom<AuthVerifyResponseInterface>(
      this.authServiceClient.send(
        { cmd: 'auth/validate-refresh-token' },
        token,
      ),
    );

    if (!result.valid)
      throw new UnauthorizedException('Invalid refresh token!');

    request.user = {
      subscriberId: result.subscriberId,
      appId: result.appId,
      userId: result.userId,
      role: result.role as string,
    };

    return true;
  }
}
