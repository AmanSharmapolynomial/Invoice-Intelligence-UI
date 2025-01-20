const ResizableModal = ({ isOpen, onClose, children, className }) => {
  const { allowModalDragging } = invoiceDetailStore();
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 800, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dialogRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }
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
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
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
      className={`${isOpen ? "flex" : "hidden"} z-50`}
      style={{
        zIndex: 999999,
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
          position: "absolute",
          transform: "none",
          pointerEvents: "auto", // Ensure modal interaction
        }}
        className={`${className} bg-white rounded-lg shadow-lg border p-0`}
      >
        <X
          className="absolute top-4 right-4 w-6 h-6 text-black/70 cursor-pointer"
          onClick={onClose}
        />
        <div
          className="p-4 overflow-auto"
          style={{ height: "calc(100% - 40px)" }}
        >
          {children}
        </div>

        <Grip
          onMouseDown={handleResizeMouseDown}
          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-b-full cursor-se-resize resize-handle"
        />
      </div>
    </div>
  );
};
