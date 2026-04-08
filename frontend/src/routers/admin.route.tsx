import { Navigate } from "react-router-dom";
import { AppRouteConfig } from "@/types";
import {
  ArchivePage,
  Assignments,
  ClassDetailLayout,
  ClassesTab,
  Dashboard,
  DirectionDetail,
  Directions,
  FreeCourses,
  Grades,
  Lessons,
  LiveClass,
  Notifications,
  Schedule,
  StudentsTab,
} from "@/pages/admin";

export const adminRoutes: AppRouteConfig[] = [
  { path: "/", element: <Dashboard /> },
  { path: "/lessons", element: <Lessons /> },
  { path: "/assignments", element: <Assignments /> },
  { path: "/schedule", element: <Schedule /> },
  { path: "/grades", element: <Grades /> },
  { path: "/live", element: <LiveClass /> },
  { path: "/courses", element: <FreeCourses /> },
  { path: "/notifications", element: <Notifications /> },
  { path: "/directions", element: <Directions /> },
  {
    path: "/directions/:directionId",
    element: <DirectionDetail />,
  },
  {
    path: "/directions/:directionId/groups/:groupId",
    element: <ClassDetailLayout />,
    children: [
      { path: "", element: <Navigate to="students" replace /> },
      { path: "students", element: <StudentsTab /> },
      { path: "classes", element: <ClassesTab /> },
    ],
  },
  { path: "/archive", element: <ArchivePage /> },
];
