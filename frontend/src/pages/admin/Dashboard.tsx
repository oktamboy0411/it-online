import { AppLayout } from "@/components/AppLayout";
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    label: "O'quvchilar",
    value: "247",
    change: "+12",
    icon: Users,
    colorClass: "stat-card-blue",
  },
  {
    label: "Darslar",
    value: "34",
    change: "+3",
    icon: BookOpen,
    colorClass: "stat-card-green",
  },
  {
    label: "Topshiriqlar",
    value: "128",
    change: "+8",
    icon: ClipboardList,
    colorClass: "stat-card-orange",
  },
  {
    label: "O'rtacha ball",
    value: "78.4",
    change: "+2.1",
    icon: TrendingUp,
    colorClass: "stat-card-purple",
  },
];

const recentActivity = [
  {
    text: "Sardor Aliyev 5-darsga javob topshirdi",
    time: "5 daqiqa oldin",
    type: "assignment",
  },
  {
    text: "Dilnoza Karimova yangi darsga yozildi",
    time: "12 daqiqa oldin",
    type: "enrollment",
  },
  {
    text: "Javohir Toshmatov test yakunladi — 92 ball",
    time: "30 daqiqa oldin",
    type: "grade",
  },
  {
    text: "Malika Raximova video darsni ko'rdi",
    time: "1 soat oldin",
    type: "lesson",
  },
  {
    text: "Azizbek Nurmatov uy vazifasini yuklab oldi",
    time: "2 soat oldin",
    type: "download",
  },
];

const upcomingLessons = [
  { title: "Python asoslari", time: "14:00 - 15:00", day: "Bugun" },
  { title: "HTML va CSS", time: "10:00 - 11:00", day: "Ertaga" },
  { title: "Algoritmlar", time: "15:00 - 16:00", day: "Chorshanba" },
];

const Dashboard = () => {
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats */}
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
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-card rounded-xl border p-5 shadow-sm animate-reveal animate-reveal-delay-2">
            <h2 className="text-base font-semibold mb-4">So'nggi faoliyat</h2>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-card rounded-xl border p-5 shadow-sm animate-reveal animate-reveal-delay-3">
            <h2 className="text-base font-semibold mb-4">Kelgusi darslar</h2>
            <div className="space-y-3">
              {upcomingLessons.map((lesson, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm font-medium">{lesson.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {lesson.day}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-primary font-medium">
                      {lesson.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export { Dashboard };
