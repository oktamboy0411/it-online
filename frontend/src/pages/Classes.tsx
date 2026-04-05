import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Plus, Users, Pencil, School } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

const ClassesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("*, class_students(id, is_active)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        const { error } = await supabase.from("classes").update({ name }).eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("classes").insert({ name });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setDialogOpen(false);
    },
  });

  const canManage = role === "admin" || role === "teacher";

  const openAdd = () => { setEditId(null); setName(""); setDialogOpen(true); };
  const openEdit = (id: string, currentName: string) => { setEditId(id); setName(currentName); setDialogOpen(true); };

  return (
    <AppLayout title="Sinflar">
      <div className="space-y-5">
        <div className="flex items-center justify-between animate-reveal">
          <p className="text-sm text-muted-foreground">Barcha faol sinflar</p>
          {canManage && (
            <Button onClick={openAdd} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Yangi sinf
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-reveal">
            <School className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">Hali sinflar mavjud emas</p>
            {canManage && <Button variant="outline" size="sm" className="mt-3" onClick={openAdd}>Sinf qo'shish</Button>}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-reveal animate-reveal-delay-1">
            {classes.map((cls: any) => {
              const activeCount = cls.class_students?.filter((s: any) => s.is_active).length ?? 0;
              return (
                <div
                  key={cls.id}
                  onClick={() => navigate(`/classes/${cls.id}`)}
                  className="group relative bg-card rounded-xl border shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <School className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-foreground">{cls.name}</h3>
                    </div>
                    {canManage && (
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(cls.id, cls.name); }}
                        className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {activeCount} o'quvchi</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Sinfni tahrirlash" : "Yangi sinf yaratish"}</DialogTitle>
              <DialogDescription>{editId ? "Sinf nomini yangilang" : "Yangi sinf uchun nom kiriting (masalan: 7-A)"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Sinf nomi</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Masalan: 7-A" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button onClick={() => saveMutation.mutate()} disabled={!name.trim() || saveMutation.isPending}>
                {editId ? "Saqlash" : "Yaratish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default ClassesPage;
