import { AppLayout } from "@/components/AppLayout";
import { FileQuestion, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const QuizzesPage = () => {
  const { role } = useAuth();

  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*, lessons(title, courses(title)), questions(id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const canManage = role === "admin" || role === "teacher";

  return (
    <AppLayout title="Testlar">
      <div className="space-y-5">
        <div className="flex items-center justify-between animate-reveal">
          <p className="text-sm text-muted-foreground">Barcha testlar</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
        ) : quizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-reveal">
            <FileQuestion className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">Hali testlar mavjud emas</p>
            <p className="text-xs text-muted-foreground mt-1">Testlarni kurs darslari ichida yarating</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-reveal animate-reveal-delay-1">
            {quizzes.map((quiz: any) => (
              <div key={quiz.id} className="bg-card rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <FileQuestion className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-sm">{quiz.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{quiz.lessons?.title} — {quiz.lessons?.courses?.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{quiz.questions?.length ?? 0} savol</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default QuizzesPage;
