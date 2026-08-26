import { Injectable } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';

const COOKIE_NAME = 'admin_token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Try httpOnly cookie first (primary — XSS-safe)
        (request: any) => request?.cookies?.[COOKIE_NAME] ?? null,
        // 2. Fall back to Authorization header (Swagger UI, API clients)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

    async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      fullName: payload.fullName,
    };
  }
}