import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JWT_ACCESS_SECRET, PUBLIC_ROUTES } from 'src/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.path;
    console.log(path);

    if (PUBLIC_ROUTES.includes(path)) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Access token was not provided.');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET || JWT_ACCESS_SECRET,
      });

      request['user'] = payload;
    } catch (_) {
      throw new UnauthorizedException('Access token is invalid.');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
