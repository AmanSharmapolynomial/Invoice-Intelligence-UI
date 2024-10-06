import {
  Dialog,
  DialogContent,
  DialogDescription
} from "@/components/ui/dialog";

const Modal = ({
  open,
  setOpen,
  children,
  className,
  title,
  titleClassName
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={`  overflow-auto pt-4 px-4 ${className}`}>
        <p className={`${titleClassName} font-medium `}> {title}</p>
        <div className="h-full !overflow-hidden">
          <div className={`  ${className}`}>{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ModalDescription = ({ children }) => (
  <DialogDescription className="">{children}</DialogDescription>
);

export { Modal, ModalDescription };

