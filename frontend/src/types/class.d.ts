export type StudentStatus = "active" | "inactive";
export type GroupStatus = "active" | "archived";
export type DirectionStatus = "active" | "archived";

export type Quarter = "1-chorak" | "2-chorak" | "yakuniy" | "3-chorak" | "4-chorak";

export const QUARTERS: { value: Quarter; label: string }[] = [
  { value: "1-chorak", label: "1-chorak" },
  { value: "2-chorak", label: "2-chorak" },
  { value: "yakuniy", label: "Yakuniy imtihon" },
  { value: "3-chorak", label: "3-chorak" },
  { value: "4-chorak", label: "4-chorak" },
];

export const CLASS_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;
export type ClassNumber = (typeof CLASS_NUMBERS)[number];

export interface Subject {
  id: string;
  name: string;
}

export interface Grade {
  studentId: string;
  subjectId: string;
  classNumber: ClassNumber;
  quarter: Quarter;
  value: number | null;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: StudentStatus;
  joinedAt: string;
  deactivatedAt?: string;
}

export interface Group {
  id: string;
  name: string;
  status: GroupStatus;
  createdAt: string;
  archivedAt?: string;
  students: Student[];
  subjects: Subject[];
  grades: Grade[];
}

export interface Direction {
  id: string;
  name: string;
  description?: string;
  status: DirectionStatus;
  createdAt: string;
  archivedAt?: string;
  groups: Group[];
}
