import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from '../interfaces/auth.interface';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends AuthenticatedUser>(
    _err: Error | null,
    user: TUser | false,
  ): TUser | null {
    return user || null;
  }
}
