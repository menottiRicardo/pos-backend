import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // shoud have extra field tenant id
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    username: string,
    password: string,
  ): Promise<any> {
    const { tenantId } = req.body;

    if (!tenantId) {
      throw new BadRequestException('Tenant id is required');
    }

    await this.authService.validateTenantId(tenantId);

    const user = await this.authService.validateUser(
      username,
      password,
      tenantId,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
