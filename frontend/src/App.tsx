import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClassesProvider } from "@/context/ClassesContext";
import { getRoutesByRole, useUserRole } from "@/routers";
import { AppRouteConfig } from "./types";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";

const queryClient = new QueryClient();

function renderRoutes(route: AppRouteConfig) {
  return (
    <Route key={route.path} path={route.path} element={route.element}>
      {route.children?.map(renderRoutes)}
    </Route>
  );
}

const App = () => {
  const [role] = useUserRole();
  const routes = getRoutesByRole(role);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ClassesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <>{routes.map(renderRoutes)}</>
              <Route path="/*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ClassesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export { App };
