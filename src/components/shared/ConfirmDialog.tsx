import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
type Props = {
  confirmMessage: string;
  onClick: () => any;
  buttonTitle: string;
  header: string;
  description: string;
};
function ConfirmDialog({
  onClick,
  confirmMessage,
  buttonTitle,
  description,
  header,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4" variant="destructive">
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="submit" onClick={onClick}>
            {confirmMessage}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
