import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useClassesContext } from "@/context/ClassesContext";
import { useLocation, useNavigate, Outlet, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClassNumber, Quarter, Student, Subject } from "@/types/class";
import { StudentFormDialog } from "@/models/StudentFormDialog";
import { StudentDeactivateDialog } from "@/models/StudentDeactivateDialog";
export interface ClassDetailOutletContext {
  isArchived: boolean;
  isGroupArchived: boolean;
  studentTab: "active" | "inactive";
  setStudentTab: (tab: "active" | "inactive") => void;
  activeStudents: Student[];
  inactiveStudents: Student[];
  displayedStudents: Student[];
  openAddStudent: () => void;
  openEditStudent: (studentId: string) => void;
  confirmDeactivate: (studentId: string) => void;
  activeClassNumber: ClassNumber;
  setActiveClassNumber: (classNumber: ClassNumber) => void;
  activeQuarter: Quarter;
  setActiveQuarter: (quarter: Quarter) => void;
  allStudentsForGrades: Student[];
  subjects: Subject[];
  getGradeValue: (studentId: string, subjectId: string) => number | null;
  handleGradeChange: (
    studentId: string,
    subjectId: string,
    value: string,
  ) => void;
}

const ClassDetailLayout = () => {
  const { directionId, groupId } = useParams<{
    directionId: string;
    groupId: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { directions, addStudent, updateStudent, deactivateStudent, setGrade } =
    useClassesContext();

  const direction = directions.find((d) => d.id === directionId);
  const selectedGroup = direction?.groups.find((g) => g.id === groupId);

  const [studentTab, setStudentTab] = useState<"active" | "inactive">("active");
  const [activeClassNumber, setActiveClassNumber] = useState<ClassNumber>(1);
  const [activeQuarter, setActiveQuarter] = useState<Quarter>("1-chorak");

  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<string | null>(null);

  if (!direction || !selectedGroup) {
    return (
      <AppLayout title="Guruh topilmadi">
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p>Bu guruh yoki yo'nalish mavjud emas.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() =>
              navigate(
                directionId ? `/directions/${directionId}` : "/directions",
              )
            }
          >
            Yo'nalishlarga qaytish
          </Button>
        </div>
      </AppLayout>
    );
  }

  const activeTab = location.pathname.endsWith("/classes")
    ? "classes"
    : "students";
  const isArchived = direction.status === "archived";
  const isGroupArchived = selectedGroup.status === "archived";

  const activeStudents = selectedGroup.students.filter(
    (s) => s.status === "active",
  );
  const inactiveStudents = selectedGroup.students.filter(
    (s) => s.status === "inactive",
  );
  const displayedStudents =
    studentTab === "active" ? activeStudents : inactiveStudents;
  const allStudentsForGrades = activeStudents;
  const subjects = selectedGroup.subjects;
  const grades = selectedGroup.grades;

  const getGradeValue = (studentId: string, subjectId: string) => {
    const grade = grades.find(
      (item) =>
        item.studentId === studentId &&
        item.subjectId === subjectId &&
        item.classNumber === activeClassNumber &&
        item.quarter === activeQuarter,
    );

    return grade?.value ?? null;
  };

  const handleGradeChange = (
    studentId: string,
    subjectId: string,
    value: string,
  ) => {
    const numberValue =
      value === "" ? null : Math.min(5, Math.max(1, parseInt(value, 10) || 0));

    setGrade(direction.id, selectedGroup.id, {
      studentId,
      subjectId,
      classNumber: activeClassNumber,
      quarter: activeQuarter,
      value: numberValue,
    });
  };

  const openAddStudent = () => {
    setEditStudentId(null);
    setStudentForm({ firstName: "", lastName: "", phone: "" });
    setStudentDialogOpen(true);
  };

  const openEditStudent = (studentId: string) => {
    const student = selectedGroup.students.find((s) => s.id === studentId);
    if (!student) return;

    setEditStudentId(studentId);
    setStudentForm({
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone,
    });
    setStudentDialogOpen(true);
  };

  const handleSaveStudent = () => {
    if (!studentForm.firstName.trim() || !studentForm.lastName.trim()) return;

    if (editStudentId) {
      updateStudent(direction.id, selectedGroup.id, editStudentId, studentForm);
    } else {
      addStudent(direction.id, selectedGroup.id, studentForm);
    }

    setStudentDialogOpen(false);
  };

  const confirmDeactivate = (studentId: string) => {
    setDeactivateTarget(studentId);
    setDeactivateDialogOpen(true);
  };

  const handleDeactivate = () => {
    if (deactivateTarget) {
      deactivateStudent(direction.id, selectedGroup.id, deactivateTarget);
    }

    setDeactivateDialogOpen(false);
    setDeactivateTarget(null);
  };

  return (
    <AppLayout title={`${direction.name} - ${selectedGroup.name} guruh`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between animate-reveal">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/directions/${direction.id}`)}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {selectedGroup.name} guruh
                </h2>
                {isGroupArchived && (
                  <Badge variant="secondary">Arxivlangan</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {direction.name} yo'nalishi
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg w-fit animate-reveal animate-reveal-delay-1">
          <button
            onClick={() =>
              navigate(
                `/directions/${direction.id}/groups/${selectedGroup.id}/students`,
              )
            }
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all active:scale-[0.97] ${
              activeTab === "students"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> O'quvchilar
            </span>
          </button>
          <button
            onClick={() =>
              navigate(
                `/directions/${direction.id}/groups/${selectedGroup.id}/classes`,
              )
            }
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all active:scale-[0.97] ${
              activeTab === "classes"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Sinflar
            </span>
          </button>
        </div>

        <Outlet
          context={
            {
              isArchived,
              isGroupArchived,
              studentTab,
              setStudentTab,
              activeStudents,
              inactiveStudents,
              displayedStudents,
              openAddStudent,
              openEditStudent,
              confirmDeactivate,
              activeClassNumber,
              setActiveClassNumber,
              activeQuarter,
              setActiveQuarter,
              allStudentsForGrades,
              subjects,
              getGradeValue,
              handleGradeChange,
            } satisfies ClassDetailOutletContext
          }
        />

        <StudentFormDialog
          open={studentDialogOpen}
          onOpenChange={setStudentDialogOpen}
          editStudentId={editStudentId}
          studentForm={studentForm}
          setStudentForm={setStudentForm}
          onSave={handleSaveStudent}
        />

        <StudentDeactivateDialog
          open={deactivateDialogOpen}
          onOpenChange={setDeactivateDialogOpen}
          onDeactivate={handleDeactivate}
        />
      </div>
    </AppLayout>
  );
};

export { ClassDetailLayout };
