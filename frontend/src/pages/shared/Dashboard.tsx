import {
  ArrowUpRight,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Users,
} from "lucide-react";

import { useClassesContext } from "@/context/ClassesContext";

const Dashboard = () => {
  const {
    assignments,
    lessons,
    notifications,
    schedule,
    totalActiveStudents,
    directions,
  } = useClassesContext();

  const gradedValues = directions.flatMap((direction) =>
    direction.groups.flatMap((group) =>
      group.grades
        .map((grade) => grade.value)
        .filter((value): value is number => typeof value === "number"),
    ),
  );
  const averageGrade = gradedValues.length
    ? (gradedValues.reduce((sum, value) => sum + value, 0) / gradedValues.length).toFixed(1)
    : "0";
  const scheduledLessons = Object.values(schedule).reduce(
    (sum, classSchedule) =>
      sum +
      Object.values(classSchedule).reduce(
        (daySum, day) => daySum + Object.values(day).filter(Boolean).length,
        0,
      ),
    0,
  );

  const stats = [
    {
      label: "O'quvchilar",
      value: totalActiveStudents,
      change: `+${totalActiveStudents}`,
      icon: Users,
      colorClass: "stat-card-blue",
    },
    {
      label: "Darslar",
      value: lessons.length,
      change: `+${lessons.length}`,
      icon: BookOpen,
      colorClass: "stat-card-green",
    },
    {
      label: "Topshiriqlar",
      value: assignments.length,
      change: `+${assignments.filter((item) => item.status !== "graded").length}`,
      icon: ClipboardList,
      colorClass: "stat-card-orange",
    },
    {
      label: "O'rtacha ball",
      value: averageGrade,
      change: `${gradedValues.length} baho`,
      icon: TrendingUp,
      colorClass: "stat-card-purple",
    },
  ];

  const recentActivity = notifications.slice(0, 5);
  const upcomingLessons = Object.entries(schedule)
    .flatMap(([groupId, classSchedule]) =>
      Object.entries(classSchedule).flatMap(([day, daySchedule]) =>
        Object.entries(daySchedule)
          .filter(([, lesson]) => Boolean(lesson))
          .map(([time, lesson]) => ({
            id: `${groupId}-${day}-${time}`,
            title: lesson?.subject || "",
            time,
            day,
          })),
      ),
    )
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`${stat.colorClass} rounded-xl p-5 shadow-sm animate-reveal animate-reveal-delay-${i}`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 opacity-80" />
              <span className="flex items-center gap-0.5 text-xs font-medium opacity-90">
                <ArrowUpRight className="h-3 w-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-80 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-sm animate-reveal animate-reveal-delay-2">
          <h2 className="text-base font-semibold mb-4">So'nggi faoliyat</h2>
          <div className="space-y-3">
            {recentActivity.length ? (
              recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Hozircha faoliyat yo'q</p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5 shadow-sm animate-reveal animate-reveal-delay-3">
          <h2 className="text-base font-semibold mb-4">Kelgusi darslar</h2>
          <div className="space-y-3">
            {upcomingLessons.length ? (
              upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm font-medium">{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{lesson.day}</span>
                    <span className="text-xs text-muted-foreground">-</span>
                    <span className="text-xs text-primary font-medium">{lesson.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Jadvalda darslar yo'q. Jami rejalangan: {scheduledLessons}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Dashboard };
