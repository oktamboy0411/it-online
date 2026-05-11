import { Bell, BookOpen, Calendar, CheckCircle2, ClipboardList } from "lucide-react";

import { useClassesContext } from "@/context/ClassesContext";

const iconByType = {
  assignment: ClipboardList,
  schedule: Calendar,
  grade: CheckCircle2,
  lesson: BookOpen,
  live: Bell,
};

const Notifications = () => {
  const { notifications, markNotificationRead } = useClassesContext();

  return (
    <div className="max-w-2xl space-y-3">
      {notifications.map((notification, i) => {
        const Icon = iconByType[notification.type];
        return (
          <button
            key={notification.id}
            onClick={() => markNotificationRead(notification.id)}
            className={`w-full text-left bg-card rounded-xl border p-4 flex items-start gap-3 shadow-sm transition-shadow hover:shadow-md animate-reveal animate-reveal-delay-${Math.min(i, 4)} ${
              !notification.read ? "border-l-4 border-l-primary" : ""
            }`}
          >
            <div
              className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                !notification.read ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}>
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{notification.desc}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5">{notification.time}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export { Notifications };
