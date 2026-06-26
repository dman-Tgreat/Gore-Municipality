import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto) {
    const admin = await this.adminsService.findByEmail(
      loginDto.email,
    );
    if(!admin) {
      throw new UnauthorizedException(
        'Invalid email or password,'
      );
    }
    if(!admin.isActive) {
      throw new UnauthorizedException(
        'Account is disabled',
      );
    }
    const passwordMatches = await bcrypt.compare(
      loginDto.password,admin.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    
    return {
    success: true,
    message: 'Login successful',
    accessToken,
    };
  }
}