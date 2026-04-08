import { useEffect, useState } from "react";
import { adminRoutes, type AppRouteConfig } from "./admin.route";
import { studentRoutes } from "./student.route";
import { teacherRoutes } from "./teacher.route";

export interface AppRouteConfig {
  path: string;
  element: JSX.Element;
  children?: AppRouteConfig[];
}

export type UserRole = "admin" | "teacher" | "student";

const ROLE_STORAGE_KEY = "it-online-role";
const ROLE_CHANGE_EVENT = "it-online-role-change";

const validRoles: UserRole[] = ["admin", "teacher", "student"];

function isUserRole(value: string | null): value is UserRole {
  return value !== null && validRoles.includes(value as UserRole);
}

export function getStoredRole(): UserRole {
  if (typeof window === "undefined") {
    return "admin";
  }

  const storedValue = window.localStorage.getItem(ROLE_STORAGE_KEY);
  return isUserRole(storedValue) ? storedValue : "admin";
}

export function setStoredRole(role: UserRole) {
  window.localStorage.setItem(ROLE_STORAGE_KEY, role);
  window.dispatchEvent(
    new CustomEvent<UserRole>(ROLE_CHANGE_EVENT, { detail: role }),
  );
}

export function useUserRole() {
  const [role, setRole] = useState<UserRole>(getStoredRole);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ROLE_STORAGE_KEY && isUserRole(event.newValue)) {
        setRole(event.newValue);
      }
    };

    const handleRoleChange = (event: Event) => {
      const roleEvent = event as CustomEvent<UserRole>;
      if (isUserRole(roleEvent.detail)) {
        setRole(roleEvent.detail);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(ROLE_CHANGE_EVENT, handleRoleChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(ROLE_CHANGE_EVENT, handleRoleChange);
    };
  }, []);

  return [role, setStoredRole] as const;
}

export function getRoutesByRole(role: UserRole): AppRouteConfig[] {
  switch (role) {
    case "teacher":
      return teacherRoutes;
    case "student":
      return studentRoutes;
    case "admin":
    default:
      return adminRoutes;
  }
}

export type { AppRouteConfig };
