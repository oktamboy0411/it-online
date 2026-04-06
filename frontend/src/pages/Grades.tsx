import { AppLayout } from "@/components/AppLayout";

const students = [
  { name: "Sardor Aliyev", dailyMarks: [85, 90, 78, 92, 88], avg: 86.6 },
  { name: "Dilnoza Karimova", dailyMarks: [92, 95, 88, 90, 94], avg: 91.8 },
  { name: "Javohir Toshmatov", dailyMarks: [70, 75, 82, 68, 77], avg: 74.4 },
  { name: "Malika Raximova", dailyMarks: [88, 84, 90, 86, 92], avg: 88.0 },
  { name: "Azizbek Nurmatov", dailyMarks: [65, 72, 60, 74, 68], avg: 67.8 },
  { name: "Nodira Xasanova", dailyMarks: [95, 98, 92, 96, 94], avg: 95.0 },
];

const days = ["Dush", "Sesh", "Chor", "Pay", "Juma"];

function gradeColor(grade: number) {
  if (grade >= 90) return "text-success font-semibold";
  if (grade >= 75) return "text-primary font-medium";
  if (grade >= 60) return "text-warning font-medium";
  return "text-destructive font-medium";
}

function avgBadge(avg: number) {
  if (avg >= 90) return "bg-success/10 text-success";
  if (avg >= 75) return "bg-primary/10 text-primary";
  if (avg >= 60) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
}

const Grades = () => {
  return (
    <AppLayout title="Baholar">
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden animate-reveal">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">O'quvchi</th>
                {days.map((d) => (
                  <th key={d} className="px-4 py-3 text-center font-medium text-muted-foreground">{d}</th>
                ))}
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">O'rtacha</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.name} className={`border-b last:border-0 animate-reveal animate-reveal-delay-${Math.min(i, 4)}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </td>
                  {s.dailyMarks.map((m, j) => (
                    <td key={j} className={`px-4 py-3 text-center tabular-nums ${gradeColor(m)}`}>
                      {m}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold tabular-nums ${avgBadge(s.avg)}`}>
                      {s.avg.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Grades;
