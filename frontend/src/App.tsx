import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClassesProvider } from "@/context/ClassesContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Lessons from "./pages/Lessons";
import Assignments from "./pages/Assignments";
import Schedule from "./pages/Schedule";
import Grades from "./pages/Grades";
import LiveClass from "./pages/LiveClass";
import FreeCourses from "./pages/FreeCourses";
import Notifications from "./pages/Notifications";
import Directions from "./pages/Directions";
import DirectionDetail from "./pages/DirectionDetail";
import ClassDetail from "./pages/ClassDetail";
import StudentsTab from "./pages/ClassDetail/StudentsTab";
import ClassesTab from "./pages/ClassDetail/ClassesTab";
import ArchivePage from "./pages/Archive";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ClassesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/live" element={<LiveClass />} />
            <Route path="/courses" element={<FreeCourses />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/directions" element={<Directions />} />
            <Route
              path="/directions/:directionId"
              element={<DirectionDetail />}
            />
            <Route
              path="/directions/:directionId/groups/:groupId"
              element={<ClassDetail />}
            >
              <Route index element={<Navigate to="students" replace />} />
              <Route path="students" element={<StudentsTab />} />
              <Route path="classes" element={<ClassesTab />} />
            </Route>
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ClassesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
