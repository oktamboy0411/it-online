import { AppLayout } from "@/components/AppLayout";
import { BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

function gradeColor(grade: number) {
  if (grade >= 5) return "text-success font-semibold";
  if (grade >= 4) return "text-primary font-medium";
  if (grade >= 3) return "text-warning font-medium";
  return "text-destructive font-medium";
}

const Grades = () => {
  const { role, user } = useAuth();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["submissions"],
    queryFn: async () => {
      let query = supabase
        .from("submissions")
        .select("*, assignments(title, lessons(title, courses(title))), profiles!submissions_student_id_fkey(full_name)")
        .order("submitted_at", { ascending: false });

      if (role === "student") {
        query = query.eq("student_id", user!.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <AppLayout title="Baholar">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-reveal">
            <BarChart3 className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">Hali baholar mavjud emas</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden animate-reveal">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/50">
                  {role !== "student" && <th className="px-4 py-3 text-left font-medium text-muted-foreground">O'quvchi</th>}
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Topshiriq</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kurs</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Baho</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Fikr</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sana</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s: any) => (
                  <tr key={s.id} className="border-b last:border-0">
                    {role !== "student" && <td className="px-4 py-3 font-medium">{s.profiles?.full_name || "—"}</td>}
                    <td className="px-4 py-3">{s.assignments?.title || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{s.assignments?.lessons?.courses?.title || "—"}</td>
                    <td className={`px-4 py-3 text-center tabular-nums ${s.grade ? gradeColor(s.grade) : "text-muted-foreground"}`}>
                      {s.grade ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">{s.feedback || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(s.submitted_at).toLocaleDateString("uz")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Grades;
