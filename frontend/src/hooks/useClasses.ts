import { useState } from "react";
import { Direction, Group, Student, Subject, Grade, ClassNumber, Quarter } from "@/types/class";
import { initialDirections } from "@/data/classesData";

export function useClasses() {
  const [directions, setDirections] = useState<Direction[]>(initialDirections);

  // Direction CRUD
  const addDirection = (data: Pick<Direction, "name" | "description">) => {
    const newDir: Direction = {
      id: crypto.randomUUID(),
      ...data,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      groups: [],
    };
    setDirections((prev) => [...prev, newDir]);
    return newDir;
  };

  const updateDirection = (id: string, data: Pick<Direction, "name" | "description">) => {
    setDirections((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
  };

  const archiveDirection = (id: string) => {
    const now = new Date().toISOString().split("T")[0];
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
      createdAt: new Date().toISOString().split("T")[0],
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
    const now = new Date().toISOString().split("T")[0];
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
      joinedAt: new Date().toISOString().split("T")[0],
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
    const now = new Date().toISOString().split("T")[0];
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

  const activeDirections = directions.filter((d) => d.status === "active");
  const archivedDirections = directions.filter((d) => d.status === "archived");

  return {
    directions,
    activeDirections,
    archivedDirections,
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
  };
}
