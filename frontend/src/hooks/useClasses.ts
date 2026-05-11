import { useCallback, useEffect, useMemo, useState } from "react";
import { Direction, Group, Student, Subject, Grade, ClassNumber, Quarter } from "@/types/class";
import { initialDirections } from "@/data/classesData";

const STORAGE_KEYS = {
  directions: "it-online-directions",
  lessons: "it-online-lessons",
  assignments: "it-online-assignments",
  notifications: "it-online-notifications",
  courses: "it-online-courses",
  liveClass: "it-online-live-class",
  schedule: "it-online-schedule",
} as const;

type AssignmentStatus = "pending" | "submitted" | "graded" | "overdue";

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  materials: number;
  category: string;
}

export interface AssignmentItem {
  id: string;
  title: string;
  deadline: string;
  status: AssignmentStatus;
  subject: string;
  submitted: number;
  total: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: "assignment" | "schedule" | "grade" | "lesson" | "live";
  read: boolean;
}

export interface CourseItem {
  id: string;
  title: string;
  lessons: number;
  students: number;
  rating: number;
  duration: string;
}

export interface LiveMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isTeacher: boolean;
}

export interface LiveParticipant {
  name: string;
  role: string;
  online: boolean;
}

export interface LiveClassState {
  title: string;
  messages: LiveMessage[];
  participants: LiveParticipant[];
}

export interface ScheduleLesson {
  subject: string;
  teacher: string;
}

export type ScheduleState = Record<string, Record<string, Record<string, ScheduleLesson | undefined>>>;

const initialLessons: LessonItem[] = [
  { id: "lesson-1", title: "Python dasturlash tili asoslari", duration: "45 min", materials: 3, category: "Python" },
  { id: "lesson-2", title: "HTML va CSS bilan web sahifa yaratish", duration: "38 min", materials: 5, category: "Web" },
  { id: "lesson-3", title: "Algoritmlar va ma'lumotlar tuzilmasi", duration: "52 min", materials: 2, category: "Algoritmlar" },
  { id: "lesson-4", title: "JavaScript asoslari", duration: "40 min", materials: 4, category: "Web" },
  { id: "lesson-5", title: "Ma'lumotlar bazasi (SQL)", duration: "35 min", materials: 3, category: "Database" },
  { id: "lesson-6", title: "Kompyuter tarmoqlari", duration: "30 min", materials: 2, category: "Tarmoq" },
];

const initialAssignments: AssignmentItem[] = [
  { id: "assignment-1", title: "Python: O'zgaruvchilar va turlar", deadline: "2026-03-22", status: "pending", subject: "Python", submitted: 18, total: 24 },
  { id: "assignment-2", title: "HTML sahifa tuzish", deadline: "2026-03-21", status: "submitted", subject: "Web", submitted: 20, total: 22 },
  { id: "assignment-3", title: "Sorting algoritmlari", deadline: "2026-03-20", status: "graded", subject: "Algoritmlar", submitted: 15, total: 15 },
  { id: "assignment-4", title: "CSS Flexbox loyihasi", deadline: "2026-03-25", status: "pending", subject: "Web", submitted: 0, total: 30 },
];

const initialNotifications: NotificationItem[] = [
  { id: "notification-1", title: "Yangi topshiriq qo'shildi", desc: "Python: O'zgaruvchilar va turlar - muddat: 22-mart", time: "10 daqiqa oldin", type: "assignment", read: false },
  { id: "notification-2", title: "Dars jadvali yangilandi", desc: "Chorshanba kuni yangi dars qo'shildi: JavaScript", time: "1 soat oldin", type: "schedule", read: false },
  { id: "notification-3", title: "Bahoyingiz chiqdi", desc: "Sorting algoritmlari topshirig'iga 87 ball oldingiz", time: "3 soat oldin", type: "grade", read: true },
  { id: "notification-4", title: "Yangi video dars", desc: "Ma'lumotlar bazasi (SQL) bo'yicha yangi dars joylandi", time: "Kecha", type: "lesson", read: true },
];

const initialCourses: CourseItem[] = [
  { id: "course-1", title: "Python dasturlash - boshlang'ich", lessons: 12, students: 1240, rating: 4.8, duration: "6 soat" },
  { id: "course-2", title: "Web dasturlash asoslari (HTML, CSS, JS)", lessons: 18, students: 980, rating: 4.7, duration: "9 soat" },
  { id: "course-3", title: "Informatika olimpiadalariga tayyorlanish", lessons: 15, students: 650, rating: 4.9, duration: "8 soat" },
  { id: "course-4", title: "Scratch bilan dasturlash", lessons: 10, students: 2100, rating: 4.6, duration: "4 soat" },
];

const initialLiveClass: LiveClassState = {
  title: "Python: Funksiyalar",
  messages: [
    { id: "message-1", sender: "Kamolov A. (O'qituvchi)", text: "Assalomu alaykum! Bugun Python'da funksiyalar mavzusini ko'rib chiqamiz.", time: "14:00", isTeacher: true },
    { id: "message-2", sender: "Sardor Aliyev", text: "Vaalaykum assalom, ustoz!", time: "14:01", isTeacher: false },
    { id: "message-3", sender: "Dilnoza Karimova", text: "Tayyor, kutib turibmiz!", time: "14:01", isTeacher: false },
  ],
  participants: [
    { name: "Kamolov A.", role: "O'qituvchi", online: true },
    { name: "Sardor Aliyev", role: "O'quvchi", online: true },
    { name: "Dilnoza Karimova", role: "O'quvchi", online: true },
    { name: "Javohir Toshmatov", role: "O'quvchi", online: false },
  ],
};

const initialSchedule: ScheduleState = {
  g1: {
    Dushanba: {
      "09:00": { subject: "Python asoslari", teacher: "Kamolov A." },
      "14:00": { subject: "Web dasturlash", teacher: "Rahimova M." },
    },
    Seshanba: { "10:00": { subject: "HTML/CSS", teacher: "Rahimova M." } },
    Chorshanba: { "09:00": { subject: "Python (amaliy)", teacher: "Kamolov A." } },
    Payshanba: { "14:00": { subject: "Web dasturlash", teacher: "Rahimova M." } },
    Juma: { "09:00": { subject: "Python (test)", teacher: "Kamolov A." } },
  },
  g2: {
    Dushanba: { "10:00": { subject: "Scratch", teacher: "Nurmatov B." } },
    Chorshanba: { "14:00": { subject: "Kompyuter savodxonligi", teacher: "Nurmatov B." } },
    Juma: { "11:00": { subject: "Algoritmlar", teacher: "Toshmatov J." } },
  },
};

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    window.localStorage.removeItem(key);
    return fallback;
  }
}

function useLocalStorageState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallback));

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key) {
        setValue(readStoredValue(key, fallback));
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [fallback, key]);

  return [value, setValue] as const;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function currentTime() {
  return new Date().toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function useClasses() {
  const [directions, setDirections] = useLocalStorageState<Direction[]>(
    STORAGE_KEYS.directions,
    initialDirections,
  );
  const [lessons, setLessons] = useLocalStorageState<LessonItem[]>(STORAGE_KEYS.lessons, initialLessons);
  const [assignments, setAssignments] = useLocalStorageState<AssignmentItem[]>(STORAGE_KEYS.assignments, initialAssignments);
  const [notifications, setNotifications] = useLocalStorageState<NotificationItem[]>(STORAGE_KEYS.notifications, initialNotifications);
  const [courses] = useLocalStorageState<CourseItem[]>(STORAGE_KEYS.courses, initialCourses);
  const [liveClass, setLiveClass] = useLocalStorageState<LiveClassState>(STORAGE_KEYS.liveClass, initialLiveClass);
  const [schedule, setSchedule] = useLocalStorageState<ScheduleState>(STORAGE_KEYS.schedule, initialSchedule);

  // Direction CRUD
  const addDirection = (data: Pick<Direction, "name" | "description">) => {
    const newDir: Direction = {
      id: crypto.randomUUID(),
      ...data,
      status: "active",
      createdAt: today(),
      groups: [],
    };
    setDirections((prev) => [...prev, newDir]);
    return newDir;
  };

  const updateDirection = (id: string, data: Pick<Direction, "name" | "description">) => {
    setDirections((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
  };

  const archiveDirection = (id: string) => {
    const now = today();
    setDirections((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "archived" as const,
              archivedAt: now,
              groups: d.groups.map((g) => ({
                ...g,
                status: "archived" as const,
                archivedAt: now,
                students: g.students.map((s) =>
                  s.status === "active" ? { ...s, status: "inactive" as const, deactivatedAt: now } : s
                ),
              })),
            }
          : d
      )
    );
  };

  // Group CRUD
  const addGroup = (directionId: string, name: string) => {
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name,
      status: "active",
      createdAt: today(),
      students: [],
      subjects: [],
      grades: [],
    };
    setDirections((prev) =>
      prev.map((d) => (d.id === directionId ? { ...d, groups: [...d.groups, newGroup] } : d))
    );
  };

  const updateGroup = (directionId: string, groupId: string, name: string) => {
    setDirections((prev) =>
      prev.map((d) =>
        d.id === directionId
          ? { ...d, groups: d.groups.map((g) => (g.id === groupId ? { ...g, name } : g)) }
          : d
      )
    );
  };

  const archiveGroup = (directionId: string, groupId: string) => {
    const now = today();
    setDirections((prev) =>
      prev.map((d) =>
        d.id === directionId
          ? {
              ...d,
              groups: d.groups.map((g) =>
                g.id === groupId
                  ? {
                      ...g,
                      status: "archived" as const,
                      archivedAt: now,
                      students: g.students.map((s) =>
                        s.status === "active" ? { ...s, status: "inactive" as const, deactivatedAt: now } : s
                      ),
                    }
                  : g
              ),
            }
          : d
      )
    );
  };

  // Student CRUD
  const addStudent = (directionId: string, groupId: string, data: Pick<Student, "firstName" | "lastName" | "phone">) => {
    const newStudent: Student = {
      id: crypto.randomUUID(),
      ...data,
      status: "active",
      joinedAt: today(),
    };
    setDirections((prev) =>
      prev.map((d) =>
        d.id === directionId
          ? { ...d, groups: d.groups.map((g) => (g.id === groupId ? { ...g, students: [...g.students, newStudent] } : g)) }
          : d
      )
    );
  };

  const updateStudent = (directionId: string, groupId: string, studentId: string, data: Pick<Student, "firstName" | "lastName" | "phone">) => {
    setDirections((prev) =>
      prev.map((d) =>
        d.id === directionId
          ? {
              ...d,
              groups: d.groups.map((g) =>
                g.id === groupId
                  ? { ...g, students: g.students.map((s) => (s.id === studentId ? { ...s, ...data } : s)) }
                  : g
              ),
            }
          : d
      )
    );
  };

  const deactivateStudent = (directionId: string, groupId: string, studentId: string) => {
    const now = today();
    setDirections((prev) =>
      prev.map((d) =>
        d.id === directionId
          ? {
              ...d,
              groups: d.groups.map((g) =>
                g.id === groupId
                  ? { ...g, students: g.students.map((s) => (s.id === studentId ? { ...s, status: "inactive" as const, deactivatedAt: now } : s)) }
                  : g
              ),
            }
          : d
      )
    );
  };

  // Subject CRUD
  const addSubject = (directionId: string, groupId: string, name: string) => {
    const newSubject: Subject = { id: crypto.randomUUID(), name };
    setDirections((prev) =>
      prev.map((d) =>
        d.id === directionId
          ? { ...d, groups: d.groups.map((g) => (g.id === groupId ? { ...g, subjects: [...g.subjects, newSubject] } : g)) }
          : d
      )
    );
  };

  const removeSubject = (directionId: string, groupId: string, subjectId: string) => {
    setDirections((prev) =>
      prev.map((d) =>
        d.id === directionId
          ? {
              ...d,
              groups: d.groups.map((g) =>
                g.id === groupId
                  ? {
                      ...g,
                      subjects: g.subjects.filter((s) => s.id !== subjectId),
                      grades: g.grades.filter((gr) => gr.subjectId !== subjectId),
                    }
                  : g
              ),
            }
          : d
      )
    );
  };

  // Grades
  const setGrade = (directionId: string, groupId: string, grade: Omit<Grade, "value"> & { value: number | null }) => {
    setDirections((prev) =>
      prev.map((d) =>
        d.id === directionId
          ? {
              ...d,
              groups: d.groups.map((g) => {
                if (g.id !== groupId) return g;
                const existingIdx = g.grades.findIndex(
                  (gr) =>
                    gr.studentId === grade.studentId &&
                    gr.subjectId === grade.subjectId &&
                    gr.classNumber === grade.classNumber &&
                    gr.quarter === grade.quarter
                );
                const newGrades = [...g.grades];
                if (existingIdx >= 0) {
                  newGrades[existingIdx] = { ...newGrades[existingIdx], value: grade.value };
                } else {
                  newGrades.push(grade);
                }
                return { ...g, grades: newGrades };
              }),
            }
          : d
      )
    );
  };

  const addLesson = (data: Pick<LessonItem, "title" | "duration" | "category">) => {
    setLessons((prev) => [
      {
        id: crypto.randomUUID(),
        title: data.title,
        duration: data.duration,
        category: data.category,
        materials: 0,
      },
      ...prev,
    ]);
  };

  const addAssignment = (data: Pick<AssignmentItem, "title" | "deadline" | "subject">) => {
    const totalStudents = directions.reduce(
      (sum, direction) =>
        sum +
        direction.groups.reduce(
          (groupSum, group) => groupSum + group.students.filter((student) => student.status === "active").length,
          0,
        ),
      0,
    );

    setAssignments((prev) => [
      {
        id: crypto.randomUUID(),
        ...data,
        status: "pending",
        submitted: 0,
        total: totalStudents,
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const sendLiveMessage = useCallback((text: string, sender = "Siz") => {
    setLiveClass((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: crypto.randomUUID(),
          sender,
          text,
          time: currentTime(),
          isTeacher: false,
        },
      ],
    }));
  }, [setLiveClass]);

  const activeDirections = useMemo(() => directions.filter((d) => d.status === "active"), [directions]);
  const archivedDirections = useMemo(() => directions.filter((d) => d.status === "archived"), [directions]);
  const activeGroups = useMemo(
    () =>
      directions.flatMap((direction) =>
        direction.groups
          .filter((group) => direction.status === "active" && group.status === "active")
          .map((group) => ({ ...group, directionId: direction.id, directionName: direction.name })),
      ),
    [directions],
  );
  const totalActiveStudents = useMemo(
    () =>
      directions.reduce(
        (sum, direction) =>
          sum +
          direction.groups.reduce(
            (groupSum, group) => groupSum + group.students.filter((student) => student.status === "active").length,
            0,
          ),
        0,
      ),
    [directions],
  );

  return {
    directions,
    activeDirections,
    archivedDirections,
    activeGroups,
    totalActiveStudents,
    lessons,
    assignments,
    notifications,
    courses,
    liveClass,
    schedule,
    addDirection,
    updateDirection,
    archiveDirection,
    addGroup,
    updateGroup,
    archiveGroup,
    addStudent,
    updateStudent,
    deactivateStudent,
    addSubject,
    removeSubject,
    setGrade,
    addLesson,
    addAssignment,
    markNotificationRead,
    sendLiveMessage,
    setSchedule,
  };
}
