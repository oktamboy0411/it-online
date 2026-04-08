import { useEffect, useState } from "react";
import { adminRoutes } from "./admin.route";
import { studentRoutes } from "./student.route";
import { teacherRoutes } from "./teacher.route";
import type { AppRouteConfig } from "@/types";

export type UserRole = "admin" | "teacher" | "student";
const validRoles: UserRole[] = ["admin", "teacher", "student"];

const ROLE_STORAGE_KEY = "it-online-role";
const ROLE_CHANGE_EVENT = "it-online-role-change";

function isUserRole(value: string | null): value is UserRole {
  return value !== null && validRoles.includes(value as UserRole);
}

export function getStoredRole(): UserRole {
  const role = window.localStorage.getItem(ROLE_STORAGE_KEY);
  return isUserRole(role) ? role : "admin";
}

export function setStoredRole(role: UserRole) {
  window.localStorage.setItem(ROLE_STORAGE_KEY, role);
  window.dispatchEvent(
    new CustomEvent<UserRole>(ROLE_CHANGE_EVENT, { detail: role }),
  );
}

export function getRoutesByRole(role: UserRole): AppRouteConfig[] {
  if (role === "teacher") return teacherRoutes;
  if (role === "student") return studentRoutes;
  return adminRoutes;
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
