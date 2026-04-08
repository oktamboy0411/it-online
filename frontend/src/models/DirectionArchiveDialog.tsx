import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DirectionArchiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive: () => void;
}

const DirectionArchiveDialog = ({
  open,
  onOpenChange,
  onArchive,
}: DirectionArchiveDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Yo'nalishni arxivlash</DialogTitle>
          <DialogDescription>
            Bu yo'nalish arxivga ko'chiriladi va barcha guruhlar hamda
            o'quvchilarning faoliyati tugatiladi.
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

export { DirectionArchiveDialog };
