import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { Grip, X } from "lucide-react";

const ResizableModal = ({ isOpen, onClose, children, className }) => {
  const { allowModalDragging } = invoiceDetailStore();
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 800, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dialogRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
    }
    if (isResizing) {
      setSize((prev) => ({
        width: Math.max(200, e.clientX - position.x),
        height: Math.max(200, e.clientY - position.y)
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeMouseDown = (e) => {
    setIsResizing(true);
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isOpen, isDragging, isResizing]);

  return (
    <div
      className={`${isOpen ? "flex" : "hidden"} z-50 !bg-red-500 `}
      open={isOpen}
      style={{
        zIndex: 999999
      }}
      setIsOpen={onClose}
      onOpenChange={(open) => {
        if (!open) {
          // onClose();
          // setSize({ width: 400, height: 400 });
          // setPosition({ x: 100, y: 100 });
        }
      }}
    >
      <div
        ref={dialogRef}
        onMouseDown={allowModalDragging && handleMouseDown}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          top: `${position.y}px`,
          left: `${position.x}px`,
          position: "absolute", // Use absolute positioning for free placement
          transform: "none",
          pointerEvents: "auto" // Ensure modal is interactive
        }}
        className={`${className} !bg-white rounded-lg shadow-lg border overflow-hidden !max-w-[100rem] resize-none p-0 !z-50`}
      >
        <X
          className="absolute top-4 right-4 text-black/70 cursor-pointer"
          onClick={() => onClose()}
        />
        <div
          className="p-4 overflow-auto !bg-white !z-50"
          style={{ height: "calc(100% - 40px)" }}
        >
          {children}
        </div>

        <Grip
          onMouseDown={handleResizeMouseDown}
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-b-full cursor-se-resize"
        />
      </div>
    </div>
  );
};

export default ResizableModal;
