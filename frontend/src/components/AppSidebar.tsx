import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Calendar,
  BarChart3,
  Video,
  PlayCircle,
  Bell,
  LogOut,
  GraduationCap,
  School,
  FileQuestion,
  Layers,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Sinflar", url: "/classes", icon: School },
  { title: "Kurslar", url: "/courses", icon: Layers },
  { title: "Darslar", url: "/lessons", icon: BookOpen },
  { title: "Topshiriqlar", url: "/assignments", icon: ClipboardList },
  { title: "Baholar", url: "/grades", icon: BarChart3 },
  { title: "Testlar", url: "/quizzes", icon: FileQuestion },
  { title: "Jadval", url: "/schedule", icon: Calendar },
];

const secondaryNav = [
  { title: "Jonli dars", url: "/live", icon: Video },
  { title: "Bepul kurslar", url: "/free-courses", icon: PlayCircle },
  { title: "Bildirishnomalar", url: "/notifications", icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const renderNavItems = (items: typeof mainNav) =>
    items.map((item) => {
      const active = location.pathname === item.url || (item.url !== "/" && location.pathname.startsWith(item.url));
      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={active}>
            <NavLink
              to={item.url}
              end={item.url === "/"}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-sidebar-accent"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-semibold text-foreground tracking-tight">Raqamli Sinf</span>
        )}
      </div>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && "Asosiy"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(mainNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && "Boshqa"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(secondaryNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && profile && (
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-medium text-foreground truncate">{profile.full_name}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Chiqish</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
