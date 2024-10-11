import no_data from "@/assets/image/no-data.svg";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfViewer = ({ pdfList, title, singlePdf = false }) => {
  
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [pdfScale, setPdfScale] = useState(0.7); // Start at a zoomed-out scale
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const pdfRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const movementFactor = 0.035;

  const handleNextPdf = () => {
    if (currentPdfIndex < pdfList.length - 1) {
      setCurrentPdfIndex(currentPdfIndex + 1);
      resetViewer();
    }
  };

  const handlePrevPdf = () => {
    if (currentPdfIndex > 0) {
      setCurrentPdfIndex(currentPdfIndex - 1);
      resetViewer();
    }
  };

  const resetViewer = () => {
    setPageNum(1);
    setNumPages(0);
    setIsError(false);
    setLoading(false);
    setOffset({ x: 0, y: 0 });
    setPdfScale(0.7); // Reset to the zoomed-out state
  };

  const resetPosition = () => {
    setOffset({ x: 0, y: 0 });
    setPdfScale(0.7); // Reset to the zoomed-out state
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setPageNum(1);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF document:", error);
    setIsError(true);
    setLoading(false);
  };

  useEffect(() => {
    resetViewer();
  }, []);

  useEffect(() => {
    resetViewer();
  }, [currentPdfIndex, pdfList]);

  const handleWheel = (event) => {
    event.preventDefault();
    const zoomAmount = 0.1;

    if (event.deltaY < 0) {
      setPdfScale((prevScale) => Math.min(prevScale + zoomAmount, 8));
    } else {
      setPdfScale((prevScale) => Math.max(prevScale - zoomAmount, 0.1));
    }
  };

  useEffect(() => {
    const pdfElement = pdfRef.current;
    if (pdfElement) {
      pdfElement.addEventListener("wheel", handleWheel);
    }
    return () => {
      if (pdfElement) {
        pdfElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, [pdfRef]);

  const handleMouseDown = (event) => {
    if (event.button === 0) {
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
      event.preventDefault();
    }
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const dx = (event.clientX - dragStart.x) * movementFactor;
      const dy = (event.clientY - dragStart.y) * movementFactor;

      setOffset((prevOffset) => ({
        x: prevOffset.x + dx,
        y: prevOffset.y + dy
      }));

      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const pdfElement = pdfRef.current;
    if (pdfElement) {
      pdfElement.addEventListener("mousemove", handleMouseMove);
      pdfElement.addEventListener("mouseup", handleMouseUp);
      pdfElement.addEventListener("mouseleave", handleMouseUp);

      return () => {
        pdfElement.removeEventListener("mousemove", handleMouseMove);
        pdfElement.removeEventListener("mouseup", handleMouseUp);
        pdfElement.removeEventListener("mouseleave", handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="pdf-viewer-container">
      <div
        className="ml-50 p-2 rounded"
        style={{ zIndex: "50", backgroundColor: "rgb(240, 240, 240)" }}
      >
        <div className="flex items-center w-full justify-center gap-x-4">
          <ZoomIn
            height={20}
            width={20}
            disabled={pdfScale >= 8}
            className="cursor-pointer"
            onClick={() => setPdfScale((s) => Math.min(s * 2, 8))}
          />
          <ZoomOut
            height={20}
            width={20}
            disabled={pdfScale <= 0.1}
            className="cursor-pointer"
            onClick={() => {
              setPdfScale((s) => Math.max(s / 2, 0.1));
              resetPosition(); // Reset height to default when zooming out
            }}
          />
          <button
            type="button"
            disabled={pageNum <= 1}
            onClick={() => setPageNum((p) => Math.max(p - 1, 1))}
            className="btn btn-sm btn-outline-secondary"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={pageNum >= numPages}
            onClick={() => setPageNum((p) => Math.min(p + 1, numPages))}
            className="btn btn-sm btn-outline-secondary"
          >
            Next
          </button>
          <button
            type="button"
            onClick={resetPosition}
            className="btn btn-sm btn-outline-secondary"
          >
            Reset
          </button>
          <div className="flex items-center gap-x-4">
            <span>
              Page {pageNum} of {numPages}
            </span>
            <Download
              height={20}
              width={20}
              className="cursor-pointer mx-4"
              onClick={() =>
                window.open(pdfList[currentPdfIndex]?.document_link, "_blank")
              }
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="w-full justify-center flex h-full items-center">
          <p>Loading ..............</p>
        </div>
      ) : isError ? (
        <div className="w-full flex flex-col justify-center items-center !h-full mt-8 overflow-hidden">
          <img src={no_data} alt="No data" className="!h-[50vh]" />
          <p>No PDF Available</p>
        </div>
      ) : (
        <div
          ref={pdfRef}
          className="h-[600px] overflow-hidden w-full "
          onMouseDown={handleMouseDown}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            position: "relative",
            userSelect: "none" // Prevent text selection
          }}
        >
          <div
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              position: "absolute",
              top: 0,
              left: 0,
              transition: isDragging ? "none" : "transform 0.1s"
            }}
            className="flex justify-center w-full bg-white "
          >
            <Document
              file={pdfList?.[currentPdfIndex]?.document_link}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadProgress={({ loaded, total }) =>
                loaded === total && setLoading(false)
              }
              noData={
                !loading && (
                  <div className="w-full flex flex-col  items-center pt-16 mt-8 h-[90vh] overflow-hidden">
                    <img src={no_data} alt="No data" className="!h-1/2" />
                    <p>No PDF Available</p>
                  </div>
                )
              }
              loading={
                <div className="w-full flex flex-col justify-center items-center !h-[580px] overflow-hidden">
                  <p>Loading PDF...</p>
                </div>
              }
              onLoadError={onDocumentLoadError}
              onLoadStart={() => setLoading(true)}
            >
              <Page
                width={900}
                pageNumber={pageNum}
                scale={pdfScale}
                loading={
                  <div className="w-full flex flex-col justify-center items-center  !h-[580px]  overflow-hidden">
                    <p>Loading Page...</p>
                  </div>
                }
              />
            </Document>
          </div>
        </div>
      )}

      {!isError && !singlePdf && (
        <div className="w-full flex justify-center gap-x-2">
          <Button
            onClick={handlePrevPdf}
            className="mt-3 !font-normal min-w-28"
            disabled={currentPdfIndex === 0 || pdfList?.length === 1}
          >
            Previous PDF
          </Button>
          <Button
            onClick={handleNextPdf}
            className="mt-3 !font-normal min-w-28"
            disabled={
              currentPdfIndex === pdfList.length - 1 || pdfList?.length === 1
            }
          >
            Next PDF
          </Button>
        </div>
      )}
    </div>
  );
};
