import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useClassesContext } from "@/context/ClassesContext";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Users, Archive, FolderOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Classes = () => {
  const { activeDirections, addDirection, updateDirection, archiveDirection } = useClassesContext();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const openCreate = () => {
    setEditId(null);
    setForm({ name: "", description: "" });
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const dir = activeDirections.find((d) => d.id === id);
    if (!dir) return;
    setEditId(id);
    setForm({ name: dir.name, description: dir.description || "" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      updateDirection(editId, form);
    } else {
      addDirection(form);
    }
    setDialogOpen(false);
  };

  const confirmArchive = (id: string) => {
    setArchiveTarget(id);
    setArchiveDialogOpen(true);
  };

  const handleArchive = () => {
    if (archiveTarget) archiveDirection(archiveTarget);
    setArchiveDialogOpen(false);
    setArchiveTarget(null);
  };

  return (
    <AppLayout title="Yo'nalishlar">
      <div className="space-y-5">
        <div className="flex items-center justify-between animate-reveal">
          <p className="text-sm text-muted-foreground">
            Jami {activeDirections.length} ta faol yo'nalish
          </p>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Yangi yo'nalish
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeDirections.map((dir, i) => {
            const totalGroups = dir.groups.filter((g) => g.status === "active").length;
            const totalStudents = dir.groups.reduce(
              (sum, g) => sum + g.students.filter((s) => s.status === "active").length,
              0
            );
            return (
              <div
                key={dir.id}
                className="group bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer animate-reveal"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => navigate(`/directions/${dir.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{dir.name}</h3>
                      {dir.description && (
                        <p className="text-xs text-muted-foreground">{dir.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(dir.id); }}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); confirmArchive(dir.id); }}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {totalGroups} guruh · {totalStudents} o'quvchi
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create / Edit dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Yo'nalishni tahrirlash" : "Yangi yo'nalish yaratish"}</DialogTitle>
              <DialogDescription>
                {editId ? "Yo'nalish ma'lumotlarini yangilang" : "Yangi yo'nalish uchun ma'lumotlarni kiriting"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nomi</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Masalan: 2010-2012" />
              </div>
              <div className="space-y-2">
                <Label>Tavsif</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Masalan: 2010-2012 yillarda tug'ilganlar" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button onClick={handleSave}>{editId ? "Saqlash" : "Yaratish"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Archive confirmation */}
        <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yo'nalishni arxivlash</DialogTitle>
              <DialogDescription>
                Bu yo'nalish arxivga ko'chiriladi va barcha guruhlar hamda o'quvchilarning faoliyati tugatiladi.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setArchiveDialogOpen(false)}>Bekor qilish</Button>
              <Button variant="destructive" onClick={handleArchive}>Arxivlash</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Classes;
