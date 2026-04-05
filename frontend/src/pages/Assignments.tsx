import { AppLayout } from "@/components/AppLayout";
import { CheckCircle2, Clock, AlertCircle, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const Assignments = () => {
  const { role } = useAuth();

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*, lessons(title, courses(title))")
        .order("deadline", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const getStatus = (deadline: string | null) => {
    if (!deadline) return { label: "Ochiq", icon: Clock, className: "text-primary bg-primary/10" };
    const d = new Date(deadline);
    if (d < new Date()) return { label: "Muddati o'tdi", icon: AlertCircle, className: "text-destructive bg-destructive/10" };
    return { label: "Kutilmoqda", icon: Clock, className: "text-warning bg-warning/10" };
  };

  return (
    <AppLayout title="Topshiriqlar">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
        ) : assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-reveal">
            <ClipboardList className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">Hali topshiriqlar mavjud emas</p>
          </div>
        ) : (
          assignments.map((a: any, i: number) => {
            const sc = getStatus(a.deadline);
            return (
              <div key={a.id} className={`bg-card rounded-xl border p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow animate-reveal animate-reveal-delay-${Math.min(i, 4)}`}>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${sc.className}`}>
                  <sc.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{a.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{a.lessons?.courses?.title}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{a.lessons?.title}</span>
                    {a.deadline && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">Muddat: {new Date(a.deadline).toLocaleDateString("uz")}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.className}`}>{sc.label}</span>
              </div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
};

export default Assignments;
