import { Navigate } from "react-router-dom";
import { AppRouteConfig } from "@/types";
import {
  Assignments,
  Dashboard,
  FreeCourses,
  Grades,
  Lessons,
  LiveClass,
  Notifications,
  Schedule,
} from "@/pages/student";

export const studentRoutes: AppRouteConfig[] = [
  { path: "/", element: <Dashboard /> },
  { path: "/lessons", element: <Lessons /> },
  { path: "/assignments", element: <Assignments /> },
  { path: "/schedule", element: <Schedule /> },
  { path: "/grades", element: <Grades /> },
  { path: "/live", element: <LiveClass /> },
  { path: "/courses", element: <FreeCourses /> },
  { path: "/notifications", element: <Notifications /> },
  { path: "*", element: <Navigate to="/" replace /> },
];
