import { Request } from 'express';
import { UserRole } from '../modules/user/user.schema';

interface RouteRoleRule {
  method: string;
  pathPattern: RegExp;
  allowedRoles: readonly UserRole[];
}

export function getAllowedRolesForRequest(
  req: Request,
  rules: readonly RouteRoleRule[],
): readonly UserRole[] | null {
  const requestPath = req.originalUrl.split('?')[0];
  const requestMethod = req.method.toUpperCase();

  const matchedRule = rules.find(
    (rule) =>
      rule.method.toUpperCase() === requestMethod &&
      rule.pathPattern.test(requestPath),
  );

  return matchedRule?.allowedRoles ?? null;
}
