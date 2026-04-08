import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useClassesContext } from "@/context/ClassesContext";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Users, Archive, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import DirectionFormDialog from "@/models/DirectionFormDialog";
import DirectionArchiveDialog from "@/models/DirectionArchiveDialog";

const Classes = () => {
  const { activeDirections, addDirection, updateDirection, archiveDirection } =
    useClassesContext();
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
            const totalGroups = dir.groups.filter(
              (g) => g.status === "active",
            ).length;
            const totalStudents = dir.groups.reduce(
              (sum, g) =>
                sum + g.students.filter((s) => s.status === "active").length,
              0,
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
                      <h3 className="font-semibold text-foreground">
                        {dir.name}
                      </h3>
                      {dir.description && (
                        <p className="text-xs text-muted-foreground">
                          {dir.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(dir.id);
                      }}
                      className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmArchive(dir.id);
                      }}
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

        <DirectionFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editId={editId}
          form={form}
          setForm={setForm}
          onSave={handleSave}
        />

        <DirectionArchiveDialog
          open={archiveDialogOpen}
          onOpenChange={setArchiveDialogOpen}
          onArchive={handleArchive}
        />
      </div>
    </AppLayout>
  );
};

export default Classes;
