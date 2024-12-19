import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Role } from './types/Role';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

export class RolesGuard extends JwtAuthGuard {
  constructor(protected readonly reflector: Reflector) {
    super(reflector);
  }

  canActivate(context: ExecutionContext) {
    const superCanActivate = super.canActivate(context);
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return superCanActivate;
    }
    const { user } = context.switchToHttp().getRequest();
    return (
      requiredRoles.some((role) => user.roles?.includes(role)) &&
      superCanActivate
    );
  }
}
