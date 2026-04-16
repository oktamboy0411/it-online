import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { getAllowedRolesForRequest, hasAllowedRole } from '../../../utils';
import { USER_ROUTE_ROLE_RULES } from '../user-role.rules';
import { AuthenticatedRequest } from './user-auth.middleware';

@Injectable()
export class UserRoleMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    if (!req.user) {
      throw new UnauthorizedException(
        'Authenticated user not found on request',
      );
    }

    const allowedRoles = getAllowedRolesForRequest(req, USER_ROUTE_ROLE_RULES);

    if (!allowedRoles) {
      next();
      return;
    }

    if (!hasAllowedRole(req.user.role, allowedRoles)) {
      throw new ForbiddenException('User role is not allowed');
    }

    next();
  }
}
