import { AppLayout } from "@/components/AppLayout";
import { Play, Clock, Users, Star, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const FreeCourses = () => {
  const navigate = useNavigate();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["free-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, lessons(id), profiles!courses_teacher_id_fkey(full_name)")
        .eq("is_free", true)
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <AppLayout title="Bepul kurslar">
      <div className="space-y-5">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-reveal">
            <Layers className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">Hali bepul kurslar mavjud emas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {courses.map((course: any, i: number) => (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className={`bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer animate-reveal animate-reveal-delay-${Math.min(i, 4)}`}
              >
                <div className="aspect-[2/1] bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex items-center justify-center">
                  <Play className="h-8 w-8 text-primary/40" />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm leading-snug">{course.title}</h3>
                  {course.description && <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{course.lessons?.length ?? 0} dars</span>
                    {course.profiles?.full_name && <span>• {course.profiles.full_name}</span>}
                  </div>
                  <Button size="sm" variant="outline" className="text-xs w-full">Boshlash</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default FreeCourses;
