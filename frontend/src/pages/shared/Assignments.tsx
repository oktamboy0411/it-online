import { AlertCircle, CheckCircle2, Clock, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useClassesContext } from "@/context/ClassesContext";

const statusConfig = {
  pending: {
    label: "Tekshirilmaydi",
    icon: Clock,
    className: "text-warning bg-warning/10",
  },
  submitted: {
    label: "Baholanmagan",
    icon: CheckCircle2,
    className: "text-success bg-success/10",
  },
  graded: {
    label: "To'liq baholandi",
    icon: CheckCircle2,
    className: "text-primary bg-primary/10",
  },
  overdue: {
    label: "Muddati o'tgan",
    icon: AlertCircle,
    className: "text-destructive bg-destructive/10",
  },
};

const Assignments = () => {
  const { assignments, addAssignment } = useClassesContext();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subject: "Python",
    deadline: new Date().toISOString().split("T")[0],
  });

  const handleAdd = () => {
    if (!form.title.trim() || !form.subject.trim()) return;
    addAssignment(form);
    setForm({ title: "", subject: "Python", deadline: new Date().toISOString().split("T")[0] });
    setIsAdding(false);
  };

  return (
    <div className="space-y-4 flex flex-col pt-2">
      <div className="flex w-full justify-start mb-2">
        <Button className="gap-2" onClick={() => setIsAdding((value) => !value)}>
          <Plus className="h-4 w-4" />
          Yangi topshiriq qo'shish
        </Button>
      </div>

      {isAdding && (
        <div className="grid gap-3 bg-card rounded-xl border p-4 shadow-sm sm:grid-cols-[1fr_160px_160px_auto]">
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Topshiriq nomi"
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            value={form.subject}
            onChange={(event) => setForm((prev) => ({ ...prev, subject: event.target.value }))}
            placeholder="Fan"
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="date"
            value={form.deadline}
            onChange={(event) => setForm((prev) => ({ ...prev, deadline: event.target.value }))}
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={handleAdd}>Saqlash</Button>
        </div>
      )}

      <div className="grid gap-4">
        {assignments.map((assignment, i) => {
          const sc = statusConfig[assignment.status];
          return (
            <div
              key={assignment.id}
              className={`bg-card rounded-xl border p-5 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow animate-reveal animate-reveal-delay-${Math.min(i, 4)} sm:flex-row sm:items-center`}
            >
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${sc.className}`}
              >
                <sc.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{assignment.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{assignment.subject}</span>
                  <span className="text-xs text-muted-foreground">-</span>
                  <span className="text-xs text-muted-foreground">
                    Muddat: {assignment.deadline}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-sm font-semibold">
                  {assignment.submitted} / {assignment.total}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.className}`}>
                  {sc.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { Assignments };
