import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { Grip, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ResizableModal = ({ 
  isOpen, 
  onClose, 
  children, 
  className, 
  x = 300, 
  y = 200, 
  height = 400, 
  width = 800 
}) => {
  const { allowModalDragging } = invoiceDetailStore();
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStartPos.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStartPos.current.y)),
      });
      e.preventDefault();
    }
    if (isResizing) {
      setSize((prev) => ({
        width: Math.max(200, e.clientX - position.x),
        height: Math.max(200, e.clientY - position.y),
      }));
      e.preventDefault();
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
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing]);

  return (
    <div
      className={`${isOpen ? "flex" : "hidden"} !z-50`}
      style={{
        zIndex: 999999
      }}
    >
      <div
        onMouseDown={allowModalDragging && handleMouseDown}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          top: `${position.y}px`,
          left: `${position.x}px`,
          position: "fixed", // Fixed for full-screen movement
          pointerEvents: "auto",
        }}
        className={`${className} bg-white rounded-lg shadow-lg border p-0 !z-50 overflow-auto`}
      >
        <div
          onClick={onClose}
          className="cursor-pointer w-8 h-8 !z-50 flex justify-center items-center absolute top-4 right-4"
        >
          <X className="w-6 h-6 text-black/70 cursor-pointer" />
        </div>
        <div
          className="p-4 overflow-auto max-h-full z-50"
          style={{ height: "calc(100% - 40px)" }}
        >
          {children}
        </div>
        <Grip
          onMouseDown={handleResizeMouseDown}
          className="absolute -bottom-0 rounded-br-full -right-0 w-4 h-4 rounded-b-full cursor-se-resize resize-handle"
        />
      </div>
    </div>
  );
};

export default ResizableModal;
