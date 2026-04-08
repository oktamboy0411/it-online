import { Navigate } from "react-router-dom";
import type { AppRouteConfig } from "./admin.route";
import { Dashboard } from "@/pages/teacher/Dashboard";
import { Login } from "@/pages/Login";
import { Lessons } from "@/pages/teacher/Lessons";
import { Assignments } from "@/pages/teacher/Assignments";
import { Schedule } from "@/pages/teacher/Schedule";
import { Grades } from "@/pages/teacher/Grades";
import { LiveClass } from "@/pages/teacher/LiveClass";
import { FreeCourses } from "@/pages/teacher/FreeCourses";
import { Notifications } from "@/pages/teacher/Notifications";
import { Directions } from "@/pages/teacher/Directions";
import { DirectionDetail } from "@/pages/teacher/DirectionDetail";
import { ClassDetailLayout as ClassDetail } from "@/pages/teacher/ClassDetail";
import { StudentsTab } from "@/pages/teacher/ClassDetail/StudentsTab";
import { ClassesTab } from "@/pages/teacher/ClassDetail/ClassesTab";
import { ArchivePage } from "@/pages/teacher/Archive";
export const teacherRoutes: AppRouteConfig[] = [
  { path: "/", element: <Dashboard /> },
  { path: "/login", element: <Login /> },
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
    element: <ClassDetail />,
    children: [
      { path: "", element: <Navigate to="students" replace /> },
      { path: "students", element: <StudentsTab /> },
      { path: "classes", element: <ClassesTab /> },
    ],
  },
  { path: "/archive", element: <ArchivePage /> },
];
