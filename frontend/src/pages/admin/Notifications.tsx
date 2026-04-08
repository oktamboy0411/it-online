import { AppLayout } from "@/components/AppLayout";
import { Bell, CheckCircle2, BookOpen, ClipboardList, Calendar } from "lucide-react";

const notifications = [
  { id: 1, title: "Yangi topshiriq qo'shildi", desc: "Python: O'zgaruvchilar va turlar — muddat: 22-mart", time: "10 daqiqa oldin", icon: ClipboardList, read: false },
  { id: 2, title: "Dars jadvali yangilandi", desc: "Chorshanba kuni yangi dars qo'shildi: JavaScript", time: "1 soat oldin", icon: Calendar, read: false },
  { id: 3, title: "Bahoyingiz chiqdi", desc: "Sorting algoritmlari topshirig'iga 87 ball oldingiz", time: "3 soat oldin", icon: CheckCircle2, read: true },
  { id: 4, title: "Yangi video dars", desc: "Ma'lumotlar bazasi (SQL) bo'yicha yangi dars joylandi", time: "Kecha", icon: BookOpen, read: true },
  { id: 5, title: "Jonli dars eslatmasi", desc: "Bugun soat 14:00 da Python darsi boshlanadi", time: "Kecha", icon: Bell, read: true },
];

const Notifications = () => {
  return (
    <AppLayout title="Bildirishnomalar">
      <div className="max-w-2xl space-y-3">
        {notifications.map((n, i) => (
          <div
            key={n.id}
            className={`bg-card rounded-xl border p-4 flex items-start gap-3 shadow-sm transition-shadow hover:shadow-md animate-reveal animate-reveal-delay-${Math.min(i, 4)} ${
              !n.read ? "border-l-4 border-l-primary" : ""
            }`}
          >
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${!n.read ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
              <n.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>{n.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export { Notifications };
