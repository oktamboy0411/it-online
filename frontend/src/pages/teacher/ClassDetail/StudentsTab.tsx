import { Pencil, Phone, Plus, UserMinus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOutletContext } from "react-router-dom";
import type { ClassDetailOutletContext } from "./Layout.tsx";

const StudentsTab = () => {
  const {
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
  } = useOutletContext<ClassDetailOutletContext>();

  return (
    <div className="space-y-4 animate-reveal">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
          <button
            onClick={() => setStudentTab("active")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              studentTab === "active"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Faol ({activeStudents.length})
          </button>
          <button
            onClick={() => setStudentTab("inactive")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              studentTab === "inactive"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
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

      {displayedStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-xl border">
          <Users className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">
            {studentTab === "active"
              ? "Faol o'quvchilar yo'q"
              : "Faoliyati tugatilgan o'quvchilar yo'q"}
          </p>
          {studentTab === "active" && !isGroupArchived && !isArchived && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={openAddStudent}
            >
              O'quvchi qo'shish
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-10">
                  #
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Ism Familiya
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Telefon
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Qo'shilgan sana
                </th>
                {studentTab === "inactive" && (
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Tugatilgan sana
                  </th>
                )}
                {!isGroupArchived && !isArchived && studentTab === "active" && (
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground w-24">
                    Amallar
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayedStudents.map((student, i) => (
                <tr
                  key={student.id}
                  className="border-b last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3 text-muted-foreground tabular-nums">
                    {i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {student.lastName} {student.firstName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {student.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {student.joinedAt}
                  </td>
                  {studentTab === "inactive" && (
                    <td className="px-4 py-3 text-muted-foreground">
                      {student.deactivatedAt || "-"}
                    </td>
                  )}
                  {!isGroupArchived &&
                    !isArchived &&
                    studentTab === "active" && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditStudent(student.id)}
                            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => confirmDeactivate(student.id)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
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
  );
};

export { StudentsTab };
