import { BookOpen, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Quarter } from "@/types";
import { useOutletContext } from "react-router-dom";
import type { ClassDetailOutletContext } from "./Layout.tsx";
import { CLASS_NUMBERS, QUARTERS } from "@/data";

const ClassesTab = () => {
  const {
    isArchived,
    isGroupArchived,
    activeClassNumber,
    setActiveClassNumber,
    activeQuarter,
    setActiveQuarter,
    allStudentsForGrades,
    subjects,
    getGradeValue,
    handleGradeChange,
  } = useOutletContext<ClassDetailOutletContext>();

  return (
    <div className="space-y-4 animate-reveal">
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

      <div className="flex items-center gap-3">
        <Select
          value={activeQuarter}
          onValueChange={(v) => setActiveQuarter(v as Quarter)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QUARTERS.map((q) => (
              <SelectItem key={q.value} value={q.value}>
                {q.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground w-8">
                    #
                  </th>
                  <th className="px-3 py-3 text-left font-medium text-muted-foreground min-w-[180px] sticky left-0 bg-secondary/50">
                    Ism Familiya
                  </th>
                  {subjects.map((sub) => (
                    <th
                      key={sub.id}
                      className="px-3 py-3 text-center font-medium text-muted-foreground min-w-[80px]"
                    >
                      {sub.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allStudentsForGrades.map((student, i) => (
                  <tr
                    key={student.id}
                    className="border-b last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-3 py-2.5 text-muted-foreground tabular-nums">
                      {i + 1}
                    </td>
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
                              onChange={(e) =>
                                handleGradeChange(
                                  student.id,
                                  sub.id,
                                  e.target.value,
                                )
                              }
                              className="w-12 h-8 text-center rounded-md border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              placeholder="-"
                            />
                          ) : (
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium ${
                                val === 5
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : val === 4
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    : val === 3
                                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                      : val === 2
                                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        : "text-muted-foreground"
                              }`}
                            >
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
  );
};

export { ClassesTab };
