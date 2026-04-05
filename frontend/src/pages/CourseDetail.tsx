import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Play, FileText, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const { data: course } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*, assignments(id)")
        .eq("course_id", id!)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("lessons").update({ title: lessonTitle, content: lessonContent, video_url: videoUrl || null }).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lessons").insert({
          course_id: id!,
          title: lessonTitle,
          content: lessonContent,
          video_url: videoUrl || null,
          sort_order: lessons.length,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lessons", id] });
      setDialogOpen(false);
      toast({ title: editId ? "Dars yangilandi" : "Dars qo'shildi" });
    },
  });

  const canManage = role === "admin" || role === "teacher";

  const openAdd = () => { setEditId(null); setLessonTitle(""); setLessonContent(""); setVideoUrl(""); setDialogOpen(true); };
  const openEdit = (lesson: any) => {
    setEditId(lesson.id); setLessonTitle(lesson.title); setLessonContent(lesson.content || ""); setVideoUrl(lesson.video_url || ""); setDialogOpen(true);
  };

  if (!course) {
    return (
      <AppLayout title="Kurs">
        <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={course.title}>
      <div className="space-y-5">
        <div className="flex items-center justify-between animate-reveal">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/courses")} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{course.title}</h2>
              {course.description && <p className="text-xs text-muted-foreground">{course.description}</p>}
            </div>
          </div>
          {canManage && (
            <Button onClick={openAdd} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Yangi dars
            </Button>
          )}
        </div>

        {lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-card rounded-xl border">
            <FileText className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">Hali darslar mavjud emas</p>
          </div>
        ) : (
          <div className="space-y-3 animate-reveal animate-reveal-delay-1">
            {lessons.map((lesson: any, i: number) => (
              <div key={lesson.id} className="group bg-card rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {lesson.video_url ? <Play className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{i + 1}. {lesson.title}</h3>
                    {lesson.content && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{lesson.content}</p>}
                    <span className="text-xs text-muted-foreground">{lesson.assignments?.length ?? 0} topshiriq</span>
                  </div>
                  {canManage && (
                    <button onClick={() => openEdit(lesson)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Darsni tahrirlash" : "Yangi dars qo'shish"}</DialogTitle>
              <DialogDescription>Dars ma'lumotlarini kiriting</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Dars nomi</Label>
                <Input value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="Masalan: Python o'zgaruvchilari" />
              </div>
              <div className="space-y-2">
                <Label>Mazmuni</Label>
                <Textarea value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} placeholder="Dars matni" rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Video URL (ixtiyoriy)</Label>
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button onClick={() => saveMutation.mutate()} disabled={!lessonTitle.trim() || saveMutation.isPending}>
                {editId ? "Saqlash" : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default CourseDetail;
