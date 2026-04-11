import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Archive,
  BookOpen,
  FolderOpen,
  Pencil,
  Plus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useClassesContext } from "@/context/ClassesContext";
import { GroupArchiveDialog } from "@/models/GroupArchiveDialog";
import { GroupFormDialog } from "@/models/GroupFormDialog";
const DirectionDetail = () => {
  const { directionId } = useParams<{ directionId: string }>();
  const navigate = useNavigate();
  const { directions, addGroup, updateGroup, archiveGroup } =
    useClassesContext();
  const direction = directions.find((item) => item.id === directionId);

  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [groupName, setGroupName] = useState("");

  const [archiveGroupDialogOpen, setArchiveGroupDialogOpen] = useState(false);
  const [archiveGroupTarget, setArchiveGroupTarget] = useState<string | null>(
    null,
  );

  if (!direction) {
    return (
      
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p>Bu yo'nalish mavjud emas.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/directions")}
          >
            Yo'nalishlarga qaytish
          </Button>
        </div>
      
    );
  }

  const isArchived = direction.status === "archived";
  const activeGroups = direction.groups.filter((g) => g.status === "active");
  const archivedGroups = direction.groups.filter(
    (g) => g.status === "archived",
  );

  const openAddGroup = () => {
    setEditGroupId(null);
    setGroupName("");
    setGroupDialogOpen(true);
  };

  const openEditGroup = (groupId: string) => {
    const group = direction.groups.find((item) => item.id === groupId);
    if (!group) return;

    setEditGroupId(groupId);
    setGroupName(group.name);
    setGroupDialogOpen(true);
  };

  const handleSaveGroup = () => {
    if (!groupName.trim()) return;

    if (editGroupId) {
      updateGroup(direction.id, editGroupId, groupName);
    } else {
      addGroup(direction.id, groupName);
    }

    setGroupDialogOpen(false);
  };

  const confirmArchiveGroup = (groupId: string) => {
    setArchiveGroupTarget(groupId);
    setArchiveGroupDialogOpen(true);
  };

  const handleArchiveGroup = () => {
    if (archiveGroupTarget) {
      archiveGroup(direction.id, archiveGroupTarget);
    }

    setArchiveGroupDialogOpen(false);
    setArchiveGroupTarget(null);
  };

  return (
    
      <div className="space-y-5">
        <div className="flex items-center justify-between animate-reveal">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(isArchived ? "/archive" : "/directions")}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {direction.name}
                </h2>
                {isArchived && <Badge variant="secondary">Arxivlangan</Badge>}
              </div>
              {direction.description && (
                <p className="text-xs text-muted-foreground">
                  {direction.description}
                </p>
              )}
            </div>
          </div>
          {!isArchived && (
            <Button onClick={openAddGroup} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Yangi guruh
            </Button>
          )}
        </div>

        {activeGroups.length === 0 && archivedGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-reveal">
            <FolderOpen className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">Bu yo'nalishda hali guruhlar yo'q</p>
            {!isArchived && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={openAddGroup}
              >
                Guruh qo'shish
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-reveal animate-reveal-delay-1">
            {activeGroups.map((group) => (
              <div
                key={group.id}
                onClick={() =>
                  navigate(
                    `/directions/${direction.id}/groups/${group.id}/students`,
                  )
                }
                className="group relative bg-card rounded-xl border shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      {group.name} guruh
                    </h3>
                  </div>
                  {!isArchived && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditGroup(group.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmArchiveGroup(group.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {
                      group.students.filter((s) => s.status === "active").length
                    }{" "}
                    o'quvchi
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" /> {group.subjects.length}{" "}
                    fan
                  </span>
                </div>
              </div>
            ))}

            {archivedGroups.map((group) => (
              <div
                key={group.id}
                onClick={() =>
                  navigate(
                    `/directions/${direction.id}/groups/${group.id}/students`,
                  )
                }
                className="relative bg-card/50 rounded-xl border border-dashed shadow-sm p-5 cursor-pointer hover:shadow-md transition-all opacity-60 hover:opacity-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Archive className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">
                    {group.name} guruh
                  </h3>
                  <Badge variant="secondary" className="text-[10px]">
                    Arxiv
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {group.students.length}{" "}
                    o'quvchi
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <GroupFormDialog
          open={groupDialogOpen}
          onOpenChange={setGroupDialogOpen}
          editGroupId={editGroupId}
          groupName={groupName}
          setGroupName={setGroupName}
          onSave={handleSaveGroup}
        />

        <GroupArchiveDialog
          open={archiveGroupDialogOpen}
          onOpenChange={setArchiveGroupDialogOpen}
          onArchive={handleArchiveGroup}
        />
      </div>
    
  );
};

export { DirectionDetail };
