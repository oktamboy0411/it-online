import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Plus, Pencil, Layers, BookOpen, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const CoursesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role, user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFree, setIsFree] = useState(false);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*, lessons(id), profiles!courses_teacher_id_fkey(full_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("courses").update({ title, description, is_free: isFree }).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert({ title, description, is_free: isFree, teacher_id: user?.id, is_published: true });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setDialogOpen(false);
    },
  });

  const canManage = role === "admin" || role === "teacher";

  const openAdd = () => { setEditId(null); setTitle(""); setDescription(""); setIsFree(false); setDialogOpen(true); };
  const openEdit = (course: any) => { setEditId(course.id); setTitle(course.title); setDescription(course.description || ""); setIsFree(course.is_free); setDialogOpen(true); };

  return (
    <AppLayout title="Kurslar">
      <div className="space-y-5">
        <div className="flex items-center justify-between animate-reveal">
          <p className="text-sm text-muted-foreground">Barcha kurslar</p>
          {canManage && (
            <Button onClick={openAdd} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Yangi kurs
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-reveal">
            <Layers className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">Hali kurslar mavjud emas</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-reveal animate-reveal-delay-1">
            {courses.map((course: any) => (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="group bg-card rounded-xl border shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="aspect-[2/1] bg-gradient-to-br from-primary/10 via-secondary to-primary/5 flex items-center justify-center">
                  <Layers className="h-8 w-8 text-primary/40" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{course.title}</h3>
                    {canManage && (
                      <button onClick={(e) => { e.stopPropagation(); openEdit(course); }} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {course.description && <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" /> {course.lessons?.length ?? 0} dars</span>
                    {course.is_free && <Badge variant="secondary" className="text-[10px]">Bepul</Badge>}
                  </div>
                  {course.profiles?.full_name && <p className="text-xs text-muted-foreground">O'qituvchi: {course.profiles.full_name}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Kursni tahrirlash" : "Yangi kurs yaratish"}</DialogTitle>
              <DialogDescription>{editId ? "Kurs ma'lumotlarini yangilang" : "Yangi kurs ma'lumotlarini kiriting"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Kurs nomi</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: Python asoslari" />
              </div>
              <div className="space-y-2">
                <Label>Tavsif</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Kurs haqida qisqacha" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isFree" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="rounded border-input" />
                <Label htmlFor="isFree">Bepul kurs</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button onClick={() => saveMutation.mutate()} disabled={!title.trim() || saveMutation.isPending}>
                {editId ? "Saqlash" : "Yaratish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default CoursesPage;
