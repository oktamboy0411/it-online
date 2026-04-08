import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editGroupId: string | null;
  groupName: string;
  setGroupName: (value: string) => void;
  onSave: () => void;
}

const GroupFormDialog = ({
  open,
  onOpenChange,
  editGroupId,
  groupName,
  setGroupName,
  onSave,
}: GroupFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editGroupId ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}
          </DialogTitle>
          <DialogDescription>
            {editGroupId
              ? "Guruh nomini yangilang"
              : "Yangi guruh uchun nom kiriting"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Guruh nomi</Label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Masalan: A"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button onClick={onSave}>
            {editGroupId ? "Saqlash" : "Yaratish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { GroupFormDialog };
