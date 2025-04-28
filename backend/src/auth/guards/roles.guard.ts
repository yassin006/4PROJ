import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('No user role found');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      console.log('⛔ Access denied:', {
        user,
        requiredRoles,
      });
      throw new ForbiddenException('Forbidden resource');
    }

    console.log('✅ Role check passed:', {
      user,
      requiredRoles,
    });

    return true;
  }
}
