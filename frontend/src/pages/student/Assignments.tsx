
import { Upload, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const assignments = [
  { id: 1, title: "Python: O'zgaruvchilar va turlar", deadline: "2026-03-22", status: "pending", subject: "Python" },
  { id: 2, title: "HTML sahifa tuzish", deadline: "2026-03-21", status: "submitted", subject: "Web" },
  { id: 3, title: "Sorting algoritmlari", deadline: "2026-03-20", status: "graded", grade: 87, subject: "Algoritmlar" },
  { id: 4, title: "CSS Flexbox loyihasi", deadline: "2026-03-25", status: "pending", subject: "Web" },
  { id: 5, title: "SQL so'rovlar yozish", deadline: "2026-03-19", status: "overdue", subject: "Database" },
  { id: 6, title: "JavaScript funksiyalar", deadline: "2026-03-24", status: "pending", subject: "Web" },
];

const statusConfig = {
  pending: { label: "Kutilmoqda", icon: Clock, className: "text-warning bg-warning/10" },
  submitted: { label: "Topshirildi", icon: CheckCircle2, className: "text-success bg-success/10" },
  graded: { label: "Baholandi", icon: CheckCircle2, className: "text-primary bg-primary/10" },
  overdue: { label: "Muddati o'tdi", icon: AlertCircle, className: "text-destructive bg-destructive/10" },
};

const Assignments = () => {
  return (
    
      <div className="space-y-4">
        {assignments.map((a, i) => {
          const sc = statusConfig[a.status as keyof typeof statusConfig];
          return (
            <div
              key={a.id}
              className={`bg-card rounded-xl border p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow animate-reveal animate-reveal-delay-${Math.min(i, 4)}`}
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${sc.className}`}>
                <sc.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{a.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{a.subject}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">Muddat: {a.deadline}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {a.status === "graded" && (
                  <span className="text-sm font-semibold text-primary">{a.grade}/100</span>
                )}
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.className}`}>
                  {sc.label}
                </span>
                {a.status === "pending" && (
                  <Button size="sm" className="gap-1.5 active:scale-[0.97] transition-transform">
                    <Upload className="h-3.5 w-3.5" /> Topshirish
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    
  );
};

export { Assignments };
