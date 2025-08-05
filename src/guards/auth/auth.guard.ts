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

export interface AuthVerifyResponse {
  valid: boolean;
  userId?: string;
  role?: string;
}

export interface RequestWithUser {
  headers: { authorization?: string };
  user?: { userId?: string; role?: string };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.ACCOUNT_SERVICE)
    private readonly authServiceClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const authHeader: string | undefined = request.headers
      ?.authorization as string;

    if (!authHeader) throw new UnauthorizedException('Missing token!');

    const token = authHeader.split(' ')[1];
    const result = await firstValueFrom<AuthVerifyResponse>(
      this.authServiceClient.send({ cmd: 'auth/validate-token' }, token),
    );

    if (!result.valid) throw new UnauthorizedException('Invalid token!');

    request.user = {
      userId: result.userId,
      role: result.role,
    };

    return true;
  }
}
