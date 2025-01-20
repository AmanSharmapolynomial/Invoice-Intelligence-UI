import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { GripVertical, X } from "lucide-react";

const Test = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 400, height: 300 });
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center">
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
        style={{ width: `${size.width}px`, height: `${size.height}px` }}
      >
        <DialogTrigger asChild>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Open Modal
          </button>
        </DialogTrigger>
        <DialogContent
          ref={dialogRef}
          onMouseDown={handleMouseDown}
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            top: `${position.y}px`,
            left: `${position.x}px`,
            position: "fixed",
            transform: "none"
          }}
          className="bg-white rounded-lg shadow-lg border overflow-hidden cursor-move resize-none p-0"
        >
          {/* Header */}

          {/* Modal Content */}
          <div
            className="p-4 overflow-auto"
            style={{ height: "calc(100% - 40px)" }}
          >
            <p>This is a draggable and resizable modal.</p>
            <p>
              Drag it by the header or resize it using the bottom-right corner.
            </p>
            <p>
              Current size: {Math.round(size.width)}px x{" "}
              {Math.round(size.height)}px
            </p>
          </div>
          {/* Resize Handle */}
          <div
            onMouseDown={handleResizeMouseDown}
            className="absolute bottom-0 right-0 w-6 h-6 bg-gray-400 cursor-se-resize"
            aria-hidden="true"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Test;
