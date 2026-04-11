
import { Play, Clock, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const courses = [
  { id: 1, title: "Python dasturlash — boshlang'ich", lessons: 12, students: 1240, rating: 4.8, duration: "6 soat" },
  { id: 2, title: "Web dasturlash asoslari (HTML, CSS, JS)", lessons: 18, students: 980, rating: 4.7, duration: "9 soat" },
  { id: 3, title: "Informatika olimpiadalariga tayyorlanish", lessons: 15, students: 650, rating: 4.9, duration: "8 soat" },
  { id: 4, title: "Scratch bilan dasturlash (bolalar uchun)", lessons: 10, students: 2100, rating: 4.6, duration: "4 soat" },
  { id: 5, title: "C++ dasturlash tili", lessons: 20, students: 430, rating: 4.5, duration: "10 soat" },
  { id: 6, title: "Kiberhavfsizlik asoslari", lessons: 8, students: 780, rating: 4.4, duration: "3.5 soat" },
];

const FreeCourses = () => {
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
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.students}</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-warning fill-warning" />{course.rating}</span>
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
