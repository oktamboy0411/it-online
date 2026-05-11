import { Clock, Download, FileText, Play, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useClassesContext } from "@/context/ClassesContext";

const categoryColors: Record<string, string> = {
  Python: "bg-primary/10 text-primary",
  Web: "bg-success/10 text-success",
  Algoritmlar: "bg-warning/10 text-warning",
  Database: "bg-destructive/10 text-destructive",
  Tarmoq: "bg-muted text-muted-foreground",
};

const Lessons = () => {
  const { lessons, addLesson } = useClassesContext();
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ title: "", duration: "45 min", category: "Python" });

  const categories = useMemo(
    () => ["Barchasi", ...Array.from(new Set(lessons.map((lesson) => lesson.category)))],
    [lessons],
  );
  const visibleLessons =
    activeCategory === "Barchasi"
      ? lessons
      : lessons.filter((lesson) => lesson.category === activeCategory);

  const handleAdd = () => {
    if (!form.title.trim() || !form.category.trim()) return;
    addLesson(form);
    setForm({ title: "", duration: "45 min", category: form.category });
    setIsAdding(false);
    setActiveCategory("Barchasi");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <Button className="shrink-0 gap-2" onClick={() => setIsAdding((value) => !value)}>
          <Plus className="h-4 w-4" />
          Yangi dars
        </Button>
      </div>

      {isAdding && (
        <div className="grid gap-3 bg-card rounded-xl border p-4 shadow-sm sm:grid-cols-[1fr_140px_140px_auto]">
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Dars nomi"
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            placeholder="Kategoriya"
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            value={form.duration}
            onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
            placeholder="Davomiyligi"
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={handleAdd}>Saqlash</Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleLessons.map((lesson, i) => (
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
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  categoryColors[lesson.category] || "bg-secondary text-secondary-foreground"
                }`}
              >
                {lesson.category}
              </span>
              <h3 className="font-medium text-sm leading-snug my-3">{lesson.title}</h3>
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
  );
};

export { Lessons };
