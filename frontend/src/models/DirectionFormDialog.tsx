import type { Dispatch, SetStateAction } from "react";
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

interface DirectionForm {
  name: string;
  description: string;
}

interface DirectionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editId: string | null;
  form: DirectionForm;
  setForm: Dispatch<SetStateAction<DirectionForm>>;
  onSave: () => void;
}

const DirectionFormDialog = ({
  open,
  onOpenChange,
  editId,
  form,
  setForm,
  onSave,
}: DirectionFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editId ? "Yo'nalishni tahrirlash" : "Yangi yo'nalish yaratish"}
          </DialogTitle>
          <DialogDescription>
            {editId
              ? "Yo'nalish ma'lumotlarini yangilang"
              : "Yangi yo'nalish uchun ma'lumotlarni kiriting"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Nomi</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Masalan: 2010-2012"
            />
          </div>
          <div className="space-y-2">
            <Label>Tavsif</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Masalan: 2010-2012 yillarda tug'ilganlar"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button onClick={onSave}>{editId ? "Saqlash" : "Yaratish"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DirectionFormDialog;
