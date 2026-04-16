
import { Upload, CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const assignments = [
  { id: 1, title: "Python: O'zgaruvchilar va turlar", deadline: "2026-03-22", status: "pending", subject: "Python", submitted: 18, total: 24 },
  { id: 2, title: "HTML sahifa tuzish", deadline: "2026-03-21", status: "submitted", subject: "Web", submitted: 20, total: 22 },
  { id: 3, title: "Sorting algoritmlari", deadline: "2026-03-20", status: "graded", subject: "Algoritmlar", submitted: 15, total: 15 },
  { id: 4, title: "CSS Flexbox loyihasi", deadline: "2026-03-25", status: "pending", subject: "Web", submitted: 0, total: 30 },
  { id: 5, title: "SQL so'rovlar yozish", deadline: "2026-03-19", status: "overdue", subject: "Database", submitted: 21, total: 25 },
  { id: 6, title: "JavaScript funksiyalar", deadline: "2026-03-24", status: "pending", subject: "Web", submitted: 2, total: 24 },
];

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
  return (
    <div className="space-y-4 flex flex-col pt-2">
      <div className="flex w-full justify-start mb-2">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Yangi topshiriq qo'shish
        </Button>
      </div>
      <div className="grid gap-4">
        {assignments.map((a, i) => {
          const sc = statusConfig[a.status as keyof typeof statusConfig];
          return (
            <div
              key={a.id}
              className={`bg-card rounded-xl border p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow animate-reveal animate-reveal-delay-${Math.min(i, 4)}`}
            >
              <div
                className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${sc.className}`}
              >
                <sc.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{a.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {a.subject}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    Muddat: {a.deadline}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6 shrink-0">
                <div className="flex flex-col items-center mr-2">
                  <span className="text-xs text-muted-foreground mb-0.5">Topshirdi / Jami</span>
                  <span className="text-sm font-semibold">{a.submitted} / {a.total}</span>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.className}`}
                >
                  {sc.label}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 active:scale-[0.97] transition-transform"
                >
                  Ko'rish
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { Assignments };
