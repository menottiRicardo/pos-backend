import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let bearerToken = request.headers.authorization;

    if (!bearerToken) {
      return false;
    }

    if (bearerToken.startsWith('Bearer ')) {
      bearerToken = bearerToken.slice(7, bearerToken.length).trim();
    }

    const decodedToken = await this.jwtService.verifyAsync(bearerToken);

    if (!decodedToken) {
      return false;
    }

    const findQuery = {
      _id: decodedToken._id,
      role: decodedToken.role,
      username: decodedToken.username,
      tenantId: decodedToken.tenantId,
    };

    const user = await this.userService.findOneUser(findQuery);

    if (!user) {
      return false;
    }

    if (user.accessToken !== bearerToken) {
      return false;
    }

    super.canActivate(context);

    request.user = user;

    return true;
  }
}
