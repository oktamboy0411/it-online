import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search } from "lucide-react";

interface AppLayoutProps {
  children?: React.ReactNode;
  title?: string;
}

interface AppLayoutContextValue {
  setTitle: (title?: string) => void;
}

const AppLayoutContext = createContext<AppLayoutContextValue | null>(null);

export function AppLayout({ children, title }: AppLayoutProps) {
  const parentLayout = useContext(AppLayoutContext);
  const [currentTitle, setCurrentTitle] = useState<string | undefined>(title);

  useEffect(() => {
    if (parentLayout) {
      parentLayout.setTitle(title);
      return () => parentLayout.setTitle(undefined);
    }
  }, [parentLayout, title]);

  useEffect(() => {
    if (!parentLayout) {
      setCurrentTitle(title);
    }
  }, [parentLayout, title]);

  if (parentLayout) {
    return <>{children ?? <Outlet />}</>;
  }

  const contextValue = useMemo<AppLayoutContextValue>(
    () => ({ setTitle: setCurrentTitle }),
    [],
  );

  return (
    <AppLayoutContext.Provider value={contextValue}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center justify-between border-b bg-card px-4 shrink-0">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                {currentTitle && (
                  <h1 className="text-lg font-semibold">{currentTitle}</h1>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Qidirish..."
                    className="bg-transparent text-sm outline-none w-48 placeholder:text-muted-foreground"
                  />
                </div>
                <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
                </button>
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground ml-1">
                  AS
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              {children ?? <Outlet />}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AppLayoutContext.Provider>
  );
}
