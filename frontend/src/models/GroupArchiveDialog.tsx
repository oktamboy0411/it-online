import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GroupArchiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive: () => void;
}

const GroupArchiveDialog = ({
  open,
  onOpenChange,
  onArchive,
}: GroupArchiveDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Guruhni arxivlash</DialogTitle>
          <DialogDescription>
            Bu guruh arxivga ko'chiriladi va barcha o'quvchilarning faoliyati
            tugatiladi.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button variant="destructive" onClick={onArchive}>
            Arxivlash
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { GroupArchiveDialog };
