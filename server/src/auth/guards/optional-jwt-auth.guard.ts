import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Like JwtAuthGuard, but does not reject unauthenticated requests.
 * If a valid Bearer token is present, `req.user` is populated;
 * otherwise `req.user` is undefined.
 *
 * Used on public read endpoints that hide draft/unpublished content
 * from anonymous visitors but show everything to logged-in admins.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    _context: ExecutionContext,
  ): TUser {
    // Ignore errors — treat invalid/missing tokens as anonymous.
    if (err || !user) {
      return undefined as TUser;
    }
    return user;
  }
}
