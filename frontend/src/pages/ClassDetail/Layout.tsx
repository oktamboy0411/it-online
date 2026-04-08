import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useClassesContext } from "@/context/ClassesContext";
import { useLocation, useNavigate, Outlet, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Archive,
  FolderOpen,
  BookOpen,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClassNumber, Quarter, Student, Subject } from "@/types/class";
import GroupFormDialog from "@/models/GroupFormDialog";
import GroupArchiveDialog from "@/models/GroupArchiveDialog";
import StudentFormDialog from "@/models/StudentFormDialog";
import StudentDeactivateDialog from "@/models/StudentDeactivateDialog";

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    directions,
    addGroup,
    updateGroup,
    archiveGroup,
    addStudent,
    updateStudent,
    deactivateStudent,
    setGrade,
  } = useClassesContext();
  const direction = directions.find((d) => d.id === id);

  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [studentTab, setStudentTab] = useState<"active" | "inactive">("active");
  const [activeClassNumber, setActiveClassNumber] = useState<ClassNumber>(1);
  const [activeQuarter, setActiveQuarter] = useState<Quarter>("1-chorak");

  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");

  const [archiveGroupDialogOpen, setArchiveGroupDialogOpen] = useState(false);
  const [archiveGroupTarget, setArchiveGroupTarget] = useState<string | null>(
    null,
  );

  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<string | null>(null);

  if (!direction) {
    return (
      <AppLayout title="Yo'nalish topilmadi">
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p>Bu yo'nalish mavjud emas.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/directions")}
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
  const activeGroups = direction.groups.filter((g) => g.status === "active");
  const archivedGroups = direction.groups.filter(
    (g) => g.status === "archived",
  );
  const selectedGroup = direction.groups.find((g) => g.id === activeGroupId);

  const activeStudents =
    selectedGroup?.students.filter((s) => s.status === "active") || [];
  const inactiveStudents =
    selectedGroup?.students.filter((s) => s.status === "inactive") || [];
  const displayedStudents =
    studentTab === "active" ? activeStudents : inactiveStudents;
  const allStudentsForGrades = activeStudents;
  const subjects = selectedGroup?.subjects || [];
  const grades = selectedGroup?.grades || [];

  const getGradeValue = (studentId: string, subjectId: string) => {
    const g = grades.find(
      (gr) =>
        gr.studentId === studentId &&
        gr.subjectId === subjectId &&
        gr.classNumber === activeClassNumber &&
        gr.quarter === activeQuarter,
    );
    return g?.value ?? null;
  };

  const handleGradeChange = (
    studentId: string,
    subjectId: string,
    value: string,
  ) => {
    if (!selectedGroup) return;
    const numVal =
      value === "" ? null : Math.min(5, Math.max(1, parseInt(value) || 0));
    setGrade(direction.id, selectedGroup.id, {
      studentId,
      subjectId,
      classNumber: activeClassNumber,
      quarter: activeQuarter,
      value: numVal,
    });
  };

  const openAddGroup = () => {
    setEditGroupId(null);
    setGroupName("");
    setGroupDialogOpen(true);
  };

  const openEditGroup = (groupId: string) => {
    const g = direction.groups.find((item) => item.id === groupId);
    if (!g) return;
    setEditGroupId(groupId);
    setGroupName(g.name);
    setGroupDialogOpen(true);
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) return;
    if (editGroupId) {
      updateGroup(direction.id, editGroupId, groupName);
    } else {
      addGroup(direction.id, groupName);
    }
    setGroupDialogOpen(false);
  };

  const confirmArchiveGroup = (groupId: string) => {
    setArchiveGroupTarget(groupId);
    setArchiveGroupDialogOpen(true);
  };

  const handleArchiveGroup = () => {
    if (archiveGroupTarget) {
      archiveGroup(direction.id, archiveGroupTarget);
      if (activeGroupId === archiveGroupTarget) {
        setActiveGroupId(null);
      }
    }
    setArchiveGroupDialogOpen(false);
    setArchiveGroupTarget(null);
  };

  const openAddStudent = () => {
    setEditStudentId(null);
    setStudentForm({ firstName: "", lastName: "", phone: "" });
    setStudentDialogOpen(true);
  };

  const openEditStudent = (studentId: string) => {
    const student = selectedGroup?.students.find((s) => s.id === studentId);
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
    if (
      !studentForm.firstName.trim() ||
      !studentForm.lastName.trim() ||
      !selectedGroup
    )
      return;
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
    if (deactivateTarget && selectedGroup) {
      deactivateStudent(direction.id, selectedGroup.id, deactivateTarget);
    }
    setDeactivateDialogOpen(false);
    setDeactivateTarget(null);
  };

  const isGroupArchived = selectedGroup?.status === "archived";

  if (!activeGroupId || !selectedGroup) {
    return (
      <AppLayout title={direction.name}>
        <div className="space-y-5">
          <div className="flex items-center justify-between animate-reveal">
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  navigate(isArchived ? "/archive" : "/directions")
                }
                className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {direction.name}
                  </h2>
                  {isArchived && <Badge variant="secondary">Arxivlangan</Badge>}
                </div>
                {direction.description && (
                  <p className="text-xs text-muted-foreground">
                    {direction.description}
                  </p>
                )}
              </div>
            </div>
            {!isArchived && (
              <Button onClick={openAddGroup} size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" /> Yangi guruh
              </Button>
            )}
          </div>

          {activeGroups.length === 0 && archivedGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-reveal">
              <FolderOpen className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">Bu yo'nalishda hali guruhlar yo'q</p>
              {!isArchived && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={openAddGroup}
                >
                  Guruh qo'shish
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-reveal animate-reveal-delay-1">
              {activeGroups.map((g) => (
                <div
                  key={g.id}
                  onClick={() => {
                    setActiveGroupId(g.id);
                    setStudentTab("active");
                    navigate(`/directions/${direction.id}/${activeTab}`);
                  }}
                  className="group relative bg-card rounded-xl border shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">
                        {g.name} guruh
                      </h3>
                    </div>
                    {!isArchived && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditGroup(g.id);
                          }}
                          className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmArchiveGroup(g.id);
                          }}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />{" "}
                      {g.students.filter((s) => s.status === "active").length}{" "}
                      o'quvchi
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> {g.subjects.length}{" "}
                      fan
                    </span>
                  </div>
                </div>
              ))}

              {archivedGroups.map((g) => (
                <div
                  key={g.id}
                  onClick={() => {
                    setActiveGroupId(g.id);
                    setStudentTab("active");
                    navigate(`/directions/${direction.id}/${activeTab}`);
                  }}
                  className="relative bg-card/50 rounded-xl border border-dashed shadow-sm p-5 cursor-pointer hover:shadow-md transition-all opacity-60 hover:opacity-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Archive className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">
                      {g.name} guruh
                    </h3>
                    <Badge variant="secondary" className="text-[10px]">
                      Arxiv
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {g.students.length}{" "}
                      o'quvchi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <GroupFormDialog
            open={groupDialogOpen}
            onOpenChange={setGroupDialogOpen}
            editGroupId={editGroupId}
            groupName={groupName}
            setGroupName={setGroupName}
            onSave={handleSaveGroup}
          />

          <GroupArchiveDialog
            open={archiveGroupDialogOpen}
            onOpenChange={setArchiveGroupDialogOpen}
            onArchive={handleArchiveGroup}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={`${direction.name} - ${selectedGroup.name} guruh`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between animate-reveal">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveGroupId(null);
                navigate(`/directions/${direction.id}`);
              }}
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
            onClick={() => navigate(`/directions/${direction.id}/students`)}
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
            onClick={() => navigate(`/directions/${direction.id}/classes`)}
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

export default ClassDetailLayout;
