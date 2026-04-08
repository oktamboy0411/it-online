import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StudentDeactivateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeactivate: () => void;
}

const StudentDeactivateDialog = ({
  open,
  onOpenChange,
  onDeactivate,
}: StudentDeactivateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>O'quvchi faoliyatini tugatish</DialogTitle>
          <DialogDescription>
            Bu o'quvchining faoliyati tugatiladi. O'quvchi o'chirilmaydi, lekin
            faol ro'yxatdan chiqariladi.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button variant="destructive" onClick={onDeactivate}>
            Faoliyatni tugatish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDeactivateDialog;
