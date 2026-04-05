import { AppLayout } from "@/components/AppLayout";
import { Play, FileText, Clock, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Lessons = () => {
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["all-lessons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*, courses(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <AppLayout title="Darslar">
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
        ) : lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-reveal">
            <BookOpen className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">Hali darslar mavjud emas</p>
            <p className="text-xs text-muted-foreground mt-1">Darslar kurslar ichida yaratiladi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {lessons.map((lesson: any, i: number) => (
              <div
                key={lesson.id}
                className={`bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-reveal animate-reveal-delay-${Math.min(i, 4)}`}
              >
                <div className="aspect-video bg-secondary flex items-center justify-center relative group cursor-pointer">
                  <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    {lesson.video_url ? <Play className="h-6 w-6 text-primary-foreground ml-0.5" /> : <FileText className="h-6 w-6 text-primary-foreground" />}
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-primary font-medium">{lesson.courses?.title}</span>
                  <h3 className="font-medium text-sm leading-snug mt-1">{lesson.title}</h3>
                  {lesson.content && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lesson.content}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Lessons;
