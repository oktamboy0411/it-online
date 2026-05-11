import { Clock, Play, Star, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClassesContext } from "@/context/ClassesContext";

const FreeCourses = () => {
  const { courses } = useClassesContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {courses.map((course, i) => (
        <div
          key={course.id}
          className={`bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-reveal animate-reveal-delay-${Math.min(i, 4)}`}
        >
          <div className="aspect-[2/1] bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
              <Play className="h-5 w-5 text-primary ml-0.5" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-sm leading-snug">{course.title}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {course.students}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-warning fill-warning" />
                {course.rating}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">{course.lessons} dars</span>
              <Button size="sm" variant="outline" className="text-xs active:scale-[0.97] transition-transform">
                Boshlash
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { FreeCourses };
