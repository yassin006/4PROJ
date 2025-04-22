// src/auth/guards/roles.guard.ts
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from '../decorators/roles.decorator';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
  
      if (!requiredRoles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user as { role?: string };
  
      if (!requiredRoles.includes(user.role as string)) {
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
      
  
      if (!user || !user.role) {
        throw new ForbiddenException('No user role found');
      }
  
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Forbidden resource');
      }
  
      return true;
    }
  }
  