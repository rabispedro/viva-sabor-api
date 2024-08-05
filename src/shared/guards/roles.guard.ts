import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return true;

    const userMatchRoles = this.matchRoles(roles, user.roles);

    if (!userMatchRoles)
      throw new UnauthorizedException('User does not have the necessary role');

    return true;
  }

  matchRoles(roles: string[], userRoles: string[]): boolean {
    const actualRoles = roles.filter((role: string) =>
      userRoles.includes(role),
    );

    return actualRoles.length > 0;
  }
}
