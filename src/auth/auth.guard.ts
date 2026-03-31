import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // comment: get token from cookie
    const token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      // comment: verify token
      const decoded = this.jwtService.verify(token);

      // comment: attach user to request
      request.user = decoded;

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
