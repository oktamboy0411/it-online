import { AppLayout } from "@/components/AppLayout";
import { Users, BookOpen, ClipboardList, TrendingUp, ArrowUpRight, Layers } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { profile, role } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [classes, courses, lessons, submissions] = await Promise.all([
        supabase.from("classes").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("lessons").select("id", { count: "exact", head: true }),
        supabase.from("submissions").select("grade").not("grade", "is", null),
      ]);
      const avgGrade = submissions.data?.length
        ? (submissions.data.reduce((sum: number, s: any) => sum + s.grade, 0) / submissions.data.length).toFixed(1)
        : "0";
      return {
        classes: classes.count ?? 0,
        courses: courses.count ?? 0,
        lessons: lessons.count ?? 0,
        avgGrade,
      };
    },
  });

  const statCards = [
    { label: "Sinflar", value: stats?.classes ?? 0, icon: Users, colorClass: "stat-card-blue" },
    { label: "Kurslar", value: stats?.courses ?? 0, icon: Layers, colorClass: "stat-card-green" },
    { label: "Darslar", value: stats?.lessons ?? 0, icon: BookOpen, colorClass: "stat-card-orange" },
    { label: "O'rtacha baho", value: stats?.avgGrade ?? "0", icon: TrendingUp, colorClass: "stat-card-purple" },
  ];

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="animate-reveal">
          <h2 className="text-lg font-semibold text-foreground">
            Xush kelibsiz, {profile?.full_name ?? "Foydalanuvchi"}! 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {role === "teacher" ? "O'qituvchi paneli" : role === "admin" ? "Admin paneli" : "O'quvchi paneli"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <div key={stat.label} className={`${stat.colorClass} rounded-xl p-5 shadow-sm animate-reveal animate-reveal-delay-${i}`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="h-5 w-5 opacity-80" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
