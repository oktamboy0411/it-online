import { UserRole } from './user.schema';

export interface UserRouteRoleRule {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  pathPattern: RegExp;
  allowedRoles: readonly UserRole[];
}

export const USER_CREATE_RULE: UserRouteRoleRule = {
  method: 'POST',
  pathPattern: /^\/users\/?$/,
  allowedRoles: [UserRole.ADMIN],
};

export const USER_FIND_ALL_RULE: UserRouteRoleRule = {
  method: 'GET',
  pathPattern: /^\/users\/?$/,
  allowedRoles: [UserRole.ADMIN, UserRole.TEACHER],
};

export const USER_FIND_ONE_RULE: UserRouteRoleRule = {
  method: 'GET',
  pathPattern: /^\/users\/[^/]+\/?$/,
  allowedRoles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT],
};

export const USER_UPDATE_RULE: UserRouteRoleRule = {
  method: 'PATCH',
  pathPattern: /^\/users\/[^/]+\/?$/,
  allowedRoles: [UserRole.ADMIN, UserRole.TEACHER],
};

export const USER_REMOVE_RULE: UserRouteRoleRule = {
  method: 'DELETE',
  pathPattern: /^\/users\/[^/]+\/?$/,
  allowedRoles: [UserRole.ADMIN],
};

export const USER_ROUTE_ROLE_RULES: readonly UserRouteRoleRule[] = [
  USER_CREATE_RULE,
  USER_FIND_ALL_RULE,
  USER_FIND_ONE_RULE,
  USER_UPDATE_RULE,
  USER_REMOVE_RULE,
];
