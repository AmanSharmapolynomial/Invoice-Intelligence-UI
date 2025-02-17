import React, { useEffect, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import zoom_in from "@/assets/image/zoom_in.svg";
import zoom_out from "@/assets/image/zoom_out.svg";
import { Skeleton } from "@/components/ui/skeleton";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FIVPdfViewer = ({
  document_link,
  document_source,
  isLoading,
  lineItem
}) => {
  const pdfWrapperRef = useRef(null);
  const [pageNum, setPageNum] = useState(1);
  const [pdfScale, setPdfScale] = useState(1.0);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });

  const boundingBoxes = lineItem
    ? Object.values(lineItem)
        .map(({ bounding_boxes, page_index }) => ({
          box: bounding_boxes,
          page_index
        }))
        .filter((bb) => bb.box)
    : [];

  useEffect(() => {
    if (boundingBoxes.length > 0) {
      const firstBox = boundingBoxes[0];
      if (firstBox.page_index + 1 !== pageNum) {
        setPageNum(firstBox.page_index + 1);
      }
    }
  }, [boundingBoxes, pageNum]);

  const getBoundingBoxStyle = (bb) => {
    if (!bb?.box || !pageDimensions.width || !pageDimensions.height) return {};

    const { width, height } = pageDimensions;
    const scaleFactor = pdfScale;

    return {
      position: "absolute",
      top: bb.box.top * height * scaleFactor,
      left: bb.box.left * width * scaleFactor - 2,
      width: bb.box.width * width * scaleFactor + 10,
      height: bb.box.height * height * scaleFactor,
      border: "1.5px solid red",
      background: "rgba(144,238,144,0.4)",
      zIndex: 9999,
      borderRadius: 5,
      paddingLeft: 20,
      paddingRight: 20,
      pointerEvents: "none"
    };
  };

  const [manualZoom, setManualZoom] = useState(false);

  const zoomToBoundingBox = () => {
    if (
      !boundingBoxes.length ||
      !pageDimensions.width ||
      !pageDimensions.height ||
      manualZoom
    )
      return; // Prevent overriding manual zoom

    const box = boundingBoxes[0].box;
    const viewer = pdfWrapperRef.current;

    if (!viewer) return;

    const boxWidth = box.width * pageDimensions.width;
    const boxHeight = box.height * pageDimensions.height;

    const scaleFactor = Math.min(
      viewer.clientWidth / boxWidth,
      viewer.clientHeight / boxHeight,
      3
    );

    setPdfScale(scaleFactor * 1); // Default zoom, only when not manually zoomed

    setTimeout(() => {
      const scaledWidth = pageDimensions.width * scaleFactor;
      const scaledHeight = pageDimensions.height * scaleFactor;

      const boxCenterX = (box.left + box.width / 2) * scaledWidth;
      const boxCenterY = (box.top + box.height / 2) * scaledHeight;

      const scrollLeft = boxCenterX - viewer.clientWidth / 2;
      const scrollTop = boxCenterY - viewer.clientHeight / 2;

      viewer.scrollTo({
        top: Math.max(0, scrollTop),
        left: Math.max(0, scrollLeft),
        behavior: "smooth"
      });
    }, 200);
  };

  // Manual Zoom Handlers
  const handleZoomIn = () => {
    setManualZoom(true);
    setPdfScale((prev) => Math.min(prev * 1.2, 8));
  };

  const handleZoomOut = () => {
    setManualZoom(true);
    setPdfScale((prev) => Math.max(prev / 1.2, 0.5));
  };

  // Reset manual zoom when document changes
  useEffect(() => {
    // setManualZoom(false);
    zoomToBoundingBox();
  }, [lineItem, isLoading, document_source, boundingBoxes]);
  const prevDocumentLink = useRef(null);

  useEffect(() => {
    if (document_link && document_link !== prevDocumentLink.current) {
      prevDocumentLink.current = document_link;
      setPageNum(1); // Reset pageNum only when document changes
    }
  }, [document_link]);

  return (
    <>
      {isLoading ? (
        <div className="w-full h-full">
          <Skeleton className={"w-full h-[26vh]"} />
        </div>
      ) : (
        <div className="max-h-fit w-[80rem] overflow-auto border rounded-sm hide-scrollbar">
          {(document_source === "azure_blob" ||
            document_source === "clickbacon") && (
            <div className="flex justify-start px-4 my-2 border-b h-10 items-center">
              <div className="flex items-center gap-x-8">
                <img
                  src={zoom_in}
                  alt="Zoom In"
                  className="cursor-pointer h-5 w-5"
                  onClick={() => handleZoomIn()}
                />
                <img
                  src={zoom_out}
                  alt="Zoom Out"
                  className="cursor-pointer h-5 w-5"
                  onClick={() => handleZoomOut()}
                />
              </div>
            </div>
          )}

          {document_source &&
          (document_source === "azure_blob" ||
            document_source === "clickbacon") ? (
            <div
              ref={pdfWrapperRef}
              className="relative flex overflow-auto show-scrollbar"
              style={{ height: "20vh", maxWidth: "100%" }}
            >
              {document_link ? (
                <Document
                  file={document_link}
                  // loading={<span className="w-[75rem] overflow-hidden h-[20vh] flex items-center justify-center"><span>Loading PDF...</span></span>}
                  onLoadSuccess={({ numPages }) => setPageNum(1)}
                >
                  <Page
                    pageNumber={pageNum}
                    scale={pdfScale}
                    onRenderSuccess={({ originalWidth, originalHeight }) =>
                      setPageDimensions({
                        width: originalWidth,
                        height: originalHeight
                      })
                    }
                    // loading={<span className="w-[75rem] overflow-hidden h-[20vh] flex items-center justify-center"><span>Loading Page...</span></span>}

                    renderTextLayer={false}
                    className="relative"
                  >
                    {boundingBoxes
                      .filter((bb) => bb.page_index + 1 === pageNum)
                      .map((bb, idx) => (
                        <div key={idx} style={getBoundingBoxStyle(bb)} />
                      ))}
                  </Page>
                </Document>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No Document Available</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex w-full justify-center items-center h-[26vh]">
              <p className="font-poppins font-semibold text-sm">
                No PDF Specified
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FIVPdfViewer;
