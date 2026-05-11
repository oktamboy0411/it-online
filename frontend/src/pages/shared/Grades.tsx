import { useClassesContext } from "@/context/ClassesContext";

function gradeColor(grade: number) {
  if (grade >= 5) return "text-success font-semibold";
  if (grade >= 4) return "text-primary font-medium";
  if (grade >= 3) return "text-warning font-medium";
  return "text-destructive font-medium";
}

function avgBadge(avg: number) {
  if (avg >= 5) return "bg-success/10 text-success";
  if (avg >= 4) return "bg-primary/10 text-primary";
  if (avg >= 3) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
}

const Grades = () => {
  const { directions } = useClassesContext();
  const students = directions.flatMap((direction) =>
    direction.groups.flatMap((group) =>
      group.students.map((student) => {
        const marks = group.grades
          .filter((grade) => grade.studentId === student.id && typeof grade.value === "number")
          .map((grade) => grade.value as number);
        const avg = marks.length
          ? marks.reduce((sum, mark) => sum + mark, 0) / marks.length
          : 0;

        return {
          id: student.id,
          name: `${student.lastName} ${student.firstName}`,
          group: `${direction.name} / ${group.name}`,
          marks,
          avg,
        };
      }),
    ),
  );

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden animate-reveal">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">O'quvchi</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Guruh</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">Baholar</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">O'rtacha</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, i) => (
              <tr
                key={student.id}
                className={`border-b last:border-0 animate-reveal animate-reveal-delay-${Math.min(i, 4)}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
                      {student.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </div>
                    <span className="font-medium">{student.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{student.group}</td>
                <td className="px-4 py-3 text-center">
                  {student.marks.length ? (
                    <span className={gradeColor(Math.round(student.avg))}>{student.marks.join(", ")}</span>
                  ) : (
                    <span className="text-muted-foreground">Baholanmagan</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold tabular-nums ${avgBadge(student.avg)}`}>
                    {student.avg ? student.avg.toFixed(1) : "-"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { Grades };
