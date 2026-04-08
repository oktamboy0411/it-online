import { AppLayout } from "@/components/AppLayout";
import { Play, FileText, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const lessons = [
  { id: 1, title: "Python dasturlash tili asoslari", duration: "45 min", materials: 3, videoUrl: "#", category: "Python" },
  { id: 2, title: "HTML va CSS bilan web sahifa yaratish", duration: "38 min", materials: 5, videoUrl: "#", category: "Web" },
  { id: 3, title: "Algoritmlar va ma'lumotlar tuzilmasi", duration: "52 min", materials: 2, videoUrl: "#", category: "Algoritmlar" },
  { id: 4, title: "JavaScript asoslari", duration: "40 min", materials: 4, videoUrl: "#", category: "Web" },
  { id: 5, title: "Ma'lumotlar bazasi (SQL)", duration: "35 min", materials: 3, videoUrl: "#", category: "Database" },
  { id: 6, title: "Kompyuter tarmoqlari", duration: "30 min", materials: 2, videoUrl: "#", category: "Tarmoq" },
];

const categoryColors: Record<string, string> = {
  Python: "bg-primary/10 text-primary",
  Web: "bg-success/10 text-success",
  Algoritmlar: "bg-warning/10 text-warning",
  Database: "bg-destructive/10 text-destructive",
  Tarmoq: "bg-muted text-muted-foreground",
};

const Lessons = () => {
  return (
    <AppLayout title="Darslar">
      <div className="space-y-6">
        <div className="flex items-center gap-2 flex-wrap">
          {["Barchasi", "Python", "Web", "Algoritmlar", "Database"].map((cat, i) => (
            <button
              key={cat}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className={`bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-reveal animate-reveal-delay-${Math.min(i, 4)}`}
            >
              <div className="aspect-video bg-secondary flex items-center justify-center relative group cursor-pointer">
                <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
                </div>
                <span className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {lesson.duration}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[lesson.category] || ""}`}>
                    {lesson.category}
                  </span>
                </div>
                <h3 className="font-medium text-sm leading-snug mb-3">{lesson.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> {lesson.materials} material
                  </span>
                  <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                    <Download className="h-3.5 w-3.5" /> Yuklab olish
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export { Lessons };
