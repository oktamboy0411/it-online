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

interface StudentForm {
  firstName: string;
  lastName: string;
  phone: string;
}

interface StudentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editStudentId: string | null;
  studentForm: StudentForm;
  setStudentForm: Dispatch<SetStateAction<StudentForm>>;
  onSave: () => void;
}

const StudentFormDialog = ({
  open,
  onOpenChange,
  editStudentId,
  studentForm,
  setStudentForm,
  onSave,
}: StudentFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editStudentId
              ? "O'quvchini tahrirlash"
              : "Yangi o'quvchi qo'shish"}
          </DialogTitle>
          <DialogDescription>
            {editStudentId
              ? "O'quvchi ma'lumotlarini yangilang"
              : "O'quvchi uchun ma'lumotlarni kiriting"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Ism</Label>
            <Input
              value={studentForm.firstName}
              onChange={(e) =>
                setStudentForm({ ...studentForm, firstName: e.target.value })
              }
              placeholder="Masalan: Alisher"
            />
          </div>
          <div className="space-y-2">
            <Label>Familiya</Label>
            <Input
              value={studentForm.lastName}
              onChange={(e) =>
                setStudentForm({ ...studentForm, lastName: e.target.value })
              }
              placeholder="Masalan: Toshmatov"
            />
          </div>
          <div className="space-y-2">
            <Label>Telefon</Label>
            <Input
              value={studentForm.phone}
              onChange={(e) =>
                setStudentForm({ ...studentForm, phone: e.target.value })
              }
              placeholder="+998901234567"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button onClick={onSave}>
            {editStudentId ? "Saqlash" : "Qo'shish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { StudentFormDialog };
