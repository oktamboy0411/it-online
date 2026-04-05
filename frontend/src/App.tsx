import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Lessons from "./pages/Lessons";
import Assignments from "./pages/Assignments";
import Schedule from "./pages/Schedule";
import Grades from "./pages/Grades";
import LiveClass from "./pages/LiveClass";
import FreeCourses from "./pages/FreeCourses";
import Notifications from "./pages/Notifications";
import ClassesPage from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import CoursesPage from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import QuizzesPage from "./pages/Quizzes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/classes" element={<ProtectedRoute><ClassesPage /></ProtectedRoute>} />
    <Route path="/classes/:id" element={<ProtectedRoute><ClassDetail /></ProtectedRoute>} />
    <Route path="/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
    <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
    <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
    <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
    <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
    <Route path="/grades" element={<ProtectedRoute><Grades /></ProtectedRoute>} />
    <Route path="/quizzes" element={<ProtectedRoute><QuizzesPage /></ProtectedRoute>} />
    <Route path="/live" element={<ProtectedRoute><LiveClass /></ProtectedRoute>} />
    <Route path="/free-courses" element={<ProtectedRoute><FreeCourses /></ProtectedRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
