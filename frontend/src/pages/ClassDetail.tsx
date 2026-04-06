import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useClassesContext } from "@/context/ClassesContext";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, UserMinus, Users, Archive, FolderOpen, BookOpen, Phone } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CLASS_NUMBERS, QUARTERS, Quarter, ClassNumber } from "@/types/class";

const DirectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    directions, addGroup, updateGroup, archiveGroup,
    addStudent, updateStudent, deactivateStudent,
    setGrade,
  } = useClassesContext();
  const direction = directions.find((d) => d.id === id);

  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [groupTab, setGroupTab] = useState<"students" | "classes">("students");
  const [studentTab, setStudentTab] = useState<"active" | "inactive">("active");
  const [activeClassNumber, setActiveClassNumber] = useState<ClassNumber>(1);
  const [activeQuarter, setActiveQuarter] = useState<Quarter>("1-chorak");

  // Group dialog
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");

  // Group archive dialog
  const [archiveGroupDialogOpen, setArchiveGroupDialogOpen] = useState(false);
  const [archiveGroupTarget, setArchiveGroupTarget] = useState<string | null>(null);

  // Student dialog
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [studentForm, setStudentForm] = useState({ firstName: "", lastName: "", phone: "" });

  // Deactivate dialog
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<string | null>(null);

  if (!direction) {
    return (
      <AppLayout title="Yo'nalish topilmadi">
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p>Bu yo'nalish mavjud emas.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/directions")}>
            Yo'nalishlarga qaytish
          </Button>
        </div>
      </AppLayout>
    );
  }

  const isArchived = direction.status === "archived";
  const activeGroups = direction.groups.filter((g) => g.status === "active");
  const archivedGroups = direction.groups.filter((g) => g.status === "archived");
  const selectedGroup = direction.groups.find((g) => g.id === activeGroupId);

  const activeStudents = selectedGroup?.students.filter((s) => s.status === "active") || [];
  const inactiveStudents = selectedGroup?.students.filter((s) => s.status === "inactive") || [];
  const subjects = selectedGroup?.subjects || [];
  const grades = selectedGroup?.grades || [];

  const getGradeValue = (studentId: string, subjectId: string) => {
    const g = grades.find(
      (gr) => gr.studentId === studentId && gr.subjectId === subjectId && gr.classNumber === activeClassNumber && gr.quarter === activeQuarter
    );
    return g?.value ?? null;
  };

  const handleGradeChange = (studentId: string, subjectId: string, value: string) => {
    if (!selectedGroup) return;
    const numVal = value === "" ? null : Math.min(5, Math.max(1, parseInt(value) || 0));
    setGrade(direction.id, selectedGroup.id, {
      studentId, subjectId, classNumber: activeClassNumber, quarter: activeQuarter, value: numVal,
    });
  };

  // Group handlers
  const openAddGroup = () => { setEditGroupId(null); setGroupName(""); setGroupDialogOpen(true); };
  const openEditGroup = (gId: string) => {
    const g = direction.groups.find((g) => g.id === gId);
    if (!g) return;
    setEditGroupId(gId); setGroupName(g.name); setGroupDialogOpen(true);
  };
  const handleSaveGroup = () => {
    if (!groupName.trim()) return;
    if (editGroupId) updateGroup(direction.id, editGroupId, groupName);
    else addGroup(direction.id, groupName);
    setGroupDialogOpen(false);
  };
  const confirmArchiveGroup = (gId: string) => { setArchiveGroupTarget(gId); setArchiveGroupDialogOpen(true); };
  const handleArchiveGroup = () => {
    if (archiveGroupTarget) {
      archiveGroup(direction.id, archiveGroupTarget);
      if (activeGroupId === archiveGroupTarget) setActiveGroupId(null);
    }
    setArchiveGroupDialogOpen(false); setArchiveGroupTarget(null);
  };

  // Student handlers
  const openAddStudent = () => { setEditStudentId(null); setStudentForm({ firstName: "", lastName: "", phone: "" }); setStudentDialogOpen(true); };
  const openEditStudent = (sId: string) => {
    const student = selectedGroup?.students.find((s) => s.id === sId);
    if (!student) return;
    setEditStudentId(sId); setStudentForm({ firstName: student.firstName, lastName: student.lastName, phone: student.phone }); setStudentDialogOpen(true);
  };
  const handleSaveStudent = () => {
    if (!studentForm.firstName.trim() || !studentForm.lastName.trim() || !selectedGroup) return;
    if (editStudentId) updateStudent(direction.id, selectedGroup.id, editStudentId, studentForm);
    else addStudent(direction.id, selectedGroup.id, studentForm);
    setStudentDialogOpen(false);
  };
  const confirmDeactivate = (sId: string) => { setDeactivateTarget(sId); setDeactivateDialogOpen(true); };
  const handleDeactivate = () => {
    if (deactivateTarget && selectedGroup) deactivateStudent(direction.id, selectedGroup.id, deactivateTarget);
    setDeactivateDialogOpen(false); setDeactivateTarget(null);
  };

  const isGroupArchived = selectedGroup?.status === "archived";

  // --- RENDER: Groups list ---
  if (!activeGroupId || !selectedGroup) {
    return (
      <AppLayout title={direction.name}>
        <div className="space-y-5">
          <div className="flex items-center justify-between animate-reveal">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(isArchived ? "/archive" : "/directions")} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">{direction.name}</h2>
                  {isArchived && <Badge variant="secondary">Arxivlangan</Badge>}
                </div>
                {direction.description && <p className="text-xs text-muted-foreground">{direction.description}</p>}
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
                <Button variant="outline" size="sm" className="mt-3" onClick={openAddGroup}>Guruh qo'shish</Button>
              )}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-reveal animate-reveal-delay-1">
              {activeGroups.map((g) => (
                <div
                  key={g.id}
                  onClick={() => { setActiveGroupId(g.id); setGroupTab("students"); setStudentTab("active"); }}
                  className="group relative bg-card rounded-xl border shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{g.name} guruh</h3>
                    </div>
                    {!isArchived && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); openEditGroup(g.id); }} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); confirmArchiveGroup(g.id); }} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {g.students.filter((s) => s.status === "active").length} o'quvchi</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {g.subjects.length} fan</span>
                  </div>
                </div>
              ))}
              {archivedGroups.map((g) => (
                <div
                  key={g.id}
                  onClick={() => { setActiveGroupId(g.id); setGroupTab("students"); setStudentTab("active"); }}
                  className="relative bg-card/50 rounded-xl border border-dashed shadow-sm p-5 cursor-pointer hover:shadow-md transition-all opacity-60 hover:opacity-100"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Archive className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">{g.name} guruh</h3>
                    <Badge variant="secondary" className="text-[10px]">Arxiv</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {g.students.length} o'quvchi</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Group dialog */}
          <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editGroupId ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}</DialogTitle>
                <DialogDescription>{editGroupId ? "Guruh nomini yangilang" : "Yangi guruh uchun nom kiriting"}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Guruh nomi</Label>
                  <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Masalan: A" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>Bekor qilish</Button>
                <Button onClick={handleSaveGroup}>{editGroupId ? "Saqlash" : "Yaratish"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Archive group confirmation */}
          <Dialog open={archiveGroupDialogOpen} onOpenChange={setArchiveGroupDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Guruhni arxivlash</DialogTitle>
                <DialogDescription>Bu guruh arxivga ko'chiriladi va barcha o'quvchilarning faoliyati tugatiladi.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setArchiveGroupDialogOpen(false)}>Bekor qilish</Button>
                <Button variant="destructive" onClick={handleArchiveGroup}>Arxivlash</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </AppLayout>
    );
  }

  // --- RENDER: Group detail with O'quvchilar / Sinflar tabs ---
  const displayedStudents = studentTab === "active" ? activeStudents : inactiveStudents;
  const allStudentsForGrades = activeStudents; // grades table always shows active students

  return (
    <AppLayout title={`${direction.name} — ${selectedGroup.name} guruh`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between animate-reveal">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveGroupId(null)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">{selectedGroup.name} guruh</h2>
                {isGroupArchived && <Badge variant="secondary">Arxivlangan</Badge>}
              </div>
              <p className="text-xs text-muted-foreground">{direction.name} yo'nalishi</p>
            </div>
          </div>
        </div>

        {/* Main tabs: O'quvchilar / Sinflar */}
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg w-fit animate-reveal animate-reveal-delay-1">
          <button
            onClick={() => setGroupTab("students")}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all active:scale-[0.97] ${
              groupTab === "students" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> O'quvchilar</span>
          </button>
          <button
            onClick={() => setGroupTab("classes")}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-all active:scale-[0.97] ${
              groupTab === "classes" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Sinflar</span>
          </button>
        </div>

        {/* ===== O'QUVCHILAR TAB ===== */}
        {groupTab === "students" && (
          <div className="space-y-4 animate-reveal">
            {/* Sub-tabs: Faol / Tugatilgan */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
                <button
                  onClick={() => setStudentTab("active")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    studentTab === "active" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Faol ({activeStudents.length})
                </button>
                <button
                  onClick={() => setStudentTab("inactive")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                    studentTab === "inactive" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tugatilgan ({inactiveStudents.length})
                </button>
              </div>
              {!isGroupArchived && !isArchived && studentTab === "active" && (
                <Button onClick={openAddStudent} size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" /> O'quvchi qo'shish
                </Button>
              )}
            </div>

            {/* Students list */}
            {displayedStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-xl border">
                <Users className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">{studentTab === "active" ? "Faol o'quvchilar yo'q" : "Faoliyati tugatilgan o'quvchilar yo'q"}</p>
                {studentTab === "active" && !isGroupArchived && !isArchived && (
                  <Button variant="outline" size="sm" className="mt-3" onClick={openAddStudent}>O'quvchi qo'shish</Button>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-secondary/50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground w-10">#</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ism Familiya</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Telefon</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Qo'shilgan sana</th>
                      {studentTab === "inactive" && (
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tugatilgan sana</th>
                      )}
                      {!isGroupArchived && !isArchived && studentTab === "active" && (
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground w-24">Amallar</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedStudents.map((student, i) => (
                      <tr key={student.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground tabular-nums">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {student.lastName} {student.firstName}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{student.phone}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{student.joinedAt}</td>
                        {studentTab === "inactive" && (
                          <td className="px-4 py-3 text-muted-foreground">{student.deactivatedAt || "-"}</td>
                        )}
                        {!isGroupArchived && !isArchived && studentTab === "active" && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openEditStudent(student.id)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => confirmDeactivate(student.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                                <UserMinus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== SINFLAR TAB ===== */}
        {groupTab === "classes" && (
          <div className="space-y-4 animate-reveal">
            {/* 11 sinf tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {CLASS_NUMBERS.map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveClassNumber(num)}
                  className={`flex-shrink-0 px-3 py-2 text-sm font-medium rounded-lg transition-all active:scale-[0.97] ${
                    activeClassNumber === num
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {num}-sinf
                </button>
              ))}
            </div>

            {/* Quarter selector */}
            <div className="flex items-center gap-3">
              <Select value={activeQuarter} onValueChange={(v) => setActiveQuarter(v as Quarter)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUARTERS.map((q) => (
                    <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grades table */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              {allStudentsForGrades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Users className="h-10 w-10 mb-3 opacity-40" />
                  <p className="text-sm">Faol o'quvchilar yo'q</p>
                </div>
              ) : subjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <BookOpen className="h-10 w-10 mb-3 opacity-40" />
                  <p className="text-sm">Fanlar hali qo'shilmagan</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-secondary/50">
                        <th className="px-3 py-3 text-left font-medium text-muted-foreground w-8">#</th>
                        <th className="px-3 py-3 text-left font-medium text-muted-foreground min-w-[180px] sticky left-0 bg-secondary/50">Ism Familiya</th>
                        {subjects.map((sub) => (
                          <th key={sub.id} className="px-3 py-3 text-center font-medium text-muted-foreground min-w-[80px]">{sub.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {allStudentsForGrades.map((student, i) => (
                        <tr key={student.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                          <td className="px-3 py-2.5 text-muted-foreground tabular-nums">{i + 1}</td>
                          <td className="px-3 py-2.5 font-medium text-foreground sticky left-0 bg-card">
                            {student.lastName} {student.firstName}
                          </td>
                          {subjects.map((sub) => {
                            const val = getGradeValue(student.id, sub.id);
                            return (
                              <td key={sub.id} className="px-3 py-2.5 text-center">
                                {!isGroupArchived && !isArchived ? (
                                  <input
                                    type="number"
                                    min={1}
                                    max={5}
                                    value={val ?? ""}
                                    onChange={(e) => handleGradeChange(student.id, sub.id, e.target.value)}
                                    className="w-12 h-8 text-center rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="-"
                                  />
                                ) : (
                                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium ${
                                    val === 5 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                    val === 4 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                    val === 3 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                    val === 2 ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                    "text-muted-foreground"
                                  }`}>
                                    {val ?? "-"}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Student dialog */}
        <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editStudentId ? "O'quvchini tahrirlash" : "Yangi o'quvchi qo'shish"}</DialogTitle>
              <DialogDescription>{editStudentId ? "O'quvchi ma'lumotlarini yangilang" : "O'quvchi uchun ma'lumotlarni kiriting"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Ism</Label>
                <Input value={studentForm.firstName} onChange={(e) => setStudentForm({ ...studentForm, firstName: e.target.value })} placeholder="Masalan: Alisher" />
              </div>
              <div className="space-y-2">
                <Label>Familiya</Label>
                <Input value={studentForm.lastName} onChange={(e) => setStudentForm({ ...studentForm, lastName: e.target.value })} placeholder="Masalan: Toshmatov" />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} placeholder="+998901234567" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStudentDialogOpen(false)}>Bekor qilish</Button>
              <Button onClick={handleSaveStudent}>{editStudentId ? "Saqlash" : "Qo'shish"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Deactivate confirmation */}
        <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>O'quvchi faoliyatini tugatish</DialogTitle>
              <DialogDescription>Bu o'quvchining faoliyati tugatiladi. O'quvchi o'chirilmaydi, lekin faol ro'yxatdan chiqariladi.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)}>Bekor qilish</Button>
              <Button variant="destructive" onClick={handleDeactivate}>Faoliyatni tugatish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default DirectionDetail;
