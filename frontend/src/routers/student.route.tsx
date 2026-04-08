import { Navigate } from "react-router-dom";
import type { AppRouteConfig } from "./admin.route";
import { Dashboard } from "@/pages/student/Dashboard";
import { Lessons } from "@/pages/student/Lessons";
import { Assignments } from "@/pages/student/Assignments";
import { Schedule } from "@/pages/student/Schedule";
import { Grades } from "@/pages/student/Grades";
import { LiveClass } from "@/pages/student/LiveClass";
import { FreeCourses } from "@/pages/student/FreeCourses";
import { Notifications } from "@/pages/student/Notifications";
import { Directions } from "@/pages/student/Directions";
import { DirectionDetail } from "@/pages/student/DirectionDetail";
import { ClassDetailLayout as ClassDetail } from "@/pages/student/ClassDetail";
import { StudentsTab } from "@/pages/student/ClassDetail/StudentsTab";
import { ClassesTab } from "@/pages/student/ClassDetail/ClassesTab";
import { ArchivePage } from "@/pages/student/Archive";
export const studentRoutes: AppRouteConfig[] = [
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
    element: <ClassDetail />,
    children: [
      { path: "", element: <Navigate to="students" replace /> },
      { path: "students", element: <StudentsTab /> },
      { path: "classes", element: <ClassesTab /> },
    ],
  },
  { path: "/archive", element: <ArchivePage /> },
];
