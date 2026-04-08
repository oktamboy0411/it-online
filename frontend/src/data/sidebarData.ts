import {
  Archive,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  PlayCircle,
  School,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { UserRole } from "@/routers";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface SidebarData {
  main: SidebarItem[];
  bottom: SidebarItem[];
}

const commonMainItems: SidebarItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Darslar", url: "/lessons", icon: BookOpen },
  { title: "Topshiriqlar", url: "/assignments", icon: ClipboardList },
  { title: "Jadval", url: "/schedule", icon: Calendar },
  { title: "Baholar", url: "/grades", icon: BarChart3 },
  { title: "Jonli dars", url: "/live", icon: Video },
  { title: "Bepul kurslar", url: "/courses", icon: PlayCircle },
  { title: "Bildirishnomalar", url: "/notifications", icon: Bell },
];

const sidebarByRole: Record<UserRole, SidebarData> = {
  admin: {
    main: [
      { title: "Yo'nalishlar", url: "/directions", icon: School },
      ...commonMainItems,
    ],
    bottom: [{ title: "Arxiv", url: "/archive", icon: Archive }],
  },
  teacher: {
    main: [
      { title: "Yo'nalishlar", url: "/directions", icon: School },
      ...commonMainItems,
    ],
    bottom: [{ title: "Arxiv", url: "/archive", icon: Archive }],
  },
  student: {
    main: commonMainItems,
    bottom: [],
  },
};

export function getSidebarDataByRole(role: UserRole): SidebarData {
  return sidebarByRole[role] ?? sidebarByRole.admin;
}
