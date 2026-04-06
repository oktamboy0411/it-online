import { Direction } from "@/types/class";

const defaultSubjects = [
  { id: "sub1", name: "Matematika" },
  { id: "sub2", name: "Ona tili" },
  { id: "sub3", name: "Tarix" },
  { id: "sub4", name: "Fizika" },
  { id: "sub5", name: "Kimyo" },
  { id: "sub6", name: "Biologiya" },
  { id: "sub7", name: "Ingliz tili" },
];

export const initialDirections: Direction[] = [
  {
    id: "1",
    name: "2010-2012",
    description: "2010-2012 yillarda tug'ilgan o'quvchilar",
    status: "active",
    createdAt: "2024-09-01",
    groups: [
      {
        id: "g1",
        name: "A",
        status: "active",
        createdAt: "2024-09-01",
        subjects: [...defaultSubjects],
        grades: [
          { studentId: "s1", subjectId: "sub1", classNumber: 5, quarter: "1-chorak", value: 4 },
          { studentId: "s1", subjectId: "sub2", classNumber: 5, quarter: "1-chorak", value: 5 },
          { studentId: "s2", subjectId: "sub1", classNumber: 5, quarter: "1-chorak", value: 3 },
        ],
        students: [
          { id: "s1", firstName: "Alisher", lastName: "Toshmatov", phone: "+998901234567", status: "active", joinedAt: "2024-09-01" },
          { id: "s2", firstName: "Nilufar", lastName: "Karimova", phone: "+998901234568", status: "active", joinedAt: "2024-09-01" },
          { id: "s3", firstName: "Jasur", lastName: "Rahimov", phone: "+998901234569", status: "active", joinedAt: "2024-09-01" },
        ],
      },
      {
        id: "g2",
        name: "B",
        status: "active",
        createdAt: "2024-09-01",
        subjects: [...defaultSubjects],
        grades: [],
        students: [
          { id: "s4", firstName: "Madina", lastName: "Saidova", phone: "+998901234570", status: "active", joinedAt: "2024-09-01" },
          { id: "s5", firstName: "Bobur", lastName: "Ergashev", phone: "+998901234571", status: "active", joinedAt: "2024-09-01" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "2006-2009",
    description: "2006-2009 yillarda tug'ilgan o'quvchilar",
    status: "active",
    createdAt: "2024-09-01",
    groups: [
      {
        id: "g3",
        name: "A",
        status: "active",
        createdAt: "2024-09-01",
        subjects: [...defaultSubjects],
        grades: [],
        students: [
          { id: "s6", firstName: "Gulnora", lastName: "Abdullayeva", phone: "+998901234572", status: "active", joinedAt: "2024-09-01" },
          { id: "s7", firstName: "Sardor", lastName: "Mirzayev", phone: "+998901234573", status: "active", joinedAt: "2024-09-01" },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "2004-2005",
    description: "2004-2005 yillarda tug'ilgan o'quvchilar",
    status: "archived",
    createdAt: "2023-09-01",
    archivedAt: "2024-06-01",
    groups: [
      {
        id: "g4",
        name: "A",
        status: "archived",
        createdAt: "2023-09-01",
        archivedAt: "2024-06-01",
        subjects: [...defaultSubjects],
        grades: [],
        students: [
          { id: "s8", firstName: "Laziz", lastName: "Normatov", phone: "+998901234576", status: "inactive", joinedAt: "2023-09-01", deactivatedAt: "2024-06-01" },
          { id: "s9", firstName: "Shaxlo", lastName: "Tursunova", phone: "+998901234577", status: "inactive", joinedAt: "2023-09-01", deactivatedAt: "2024-06-01" },
        ],
      },
    ],
  },
];
