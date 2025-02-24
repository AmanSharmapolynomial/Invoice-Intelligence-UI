import zoom_in from "@/assets/image/zoom_in.svg";
import zoom_out from "@/assets/image/zoom_out.svg";
import fastItemVerificationStore from "@/store/fastItemVerificationStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const FIVPdfViewer = ({}) => {
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const {
    fiv_document_link,
    fiv_document_source,

    fiv_current_item: lineItem,
    setFIVBoundingBoxes,
    fiv_item_array,
    setFIVCurrentItem
  } = fastItemVerificationStore();
  const document_link = fiv_item_array?.[currentPdfIndex]?.document_link;
  const document_source = fiv_item_array?.[currentPdfIndex]?.document_source;

  const boundingBoxes = lineItem?.line_item
    ? Object?.values(lineItem?.line_item)
        .map(({ bounding_boxes, page_index }) => ({
          box: bounding_boxes,
          page_index
        }))
        .filter((bb) => bb.box)
    : [];

  const pdfWrapperRef = useRef(null);
  const [pageNum, setPageNum] = useState(1);
  const [pdfScale, setPdfScale] = useState(1.0);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (boundingBoxes.length > 0) {
      const firstBox = boundingBoxes[0];
      if (firstBox.page_index + 1 !== pageNum) {
        setPageNum(firstBox.page_index + 1);
      }
    }
  }, [boundingBoxes, pageNum, lineItem]);

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
    if (!boundingBoxes.length || !pageDimensions.width || !pageDimensions.height || manualZoom) 
      return; // Prevent overriding manual zoom
  
    const viewer = pdfWrapperRef.current;
    if (!viewer) return;
  
    // Get bounding boxes for the current page
    const pageBoundingBoxes = boundingBoxes.filter(bb => bb.page_index + 1 === pageNum);
    if (!pageBoundingBoxes.length) return;
  
    // Calculate the union of all bounding boxes (to fit all in view)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    pageBoundingBoxes.forEach(bb => {
      const box = bb.box;
      minX = Math.min(minX, box.left);
      minY = Math.min(minY, box.top);
      maxX = Math.max(maxX, box.left + box.width);
      maxY = Math.max(maxY, box.top + box.height);
    });
  
    // Convert to absolute dimensions
    const boxWidth = (maxX - minX) * pageDimensions.width;
    const boxHeight = (maxY - minY) * pageDimensions.height;
  
    // Determine appropriate scale factor
    const scaleFactor = Math.min(viewer.clientWidth / boxWidth, viewer.clientHeight / boxHeight, 3)-0.2;
  
    // Apply zoom level
    setPdfScale(scaleFactor);
  
    setTimeout(() => {
      const scaledWidth = pageDimensions.width * scaleFactor;
      const scaledHeight = pageDimensions.height * scaleFactor;
  
      // Calculate center of the bounding box area
      const boxCenterX = (minX + (maxX - minX) / 2) * scaledWidth;
      const boxCenterY = (minY + (maxY - minY) / 2) * scaledHeight;
  
      // Adjust scroll to center the bounding box
      const scrollLeft = boxCenterX - viewer.clientWidth / 2;
      const scrollTop = boxCenterY - viewer.clientHeight / 2;
  
      viewer.scrollTo({
        top: Math.max(0, scrollTop),
        left: Math.max(0, scrollLeft),
        behavior: "smooth",
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
  }, [lineItem, , document_source, boundingBoxes]);
  const prevDocumentLink = useRef(null);

  useEffect(() => {
    if (document_link && document_link !== prevDocumentLink.current) {
      prevDocumentLink.current = document_link;
      setPageNum(1); // Reset pageNum only when document changes
    }
  }, [document_link]);

  return (
    <>
      <div className="max-h-fit w-[80rem] overflow-auto border rounded-sm hide-scrollbar">
        {(document_source === "azure_blob" ||
          document_source === "clickbacon") && (
          <div className="flex justify-between px-4 my-2 border-b h-10 items-center">
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

            <div className="font-poppins font-medium text-sm  flex items-center gap-x-2">
              <ChevronLeft
                className="h-5 w-5 cursor-pointer"
                onClick={() => {
                  if (currentPdfIndex !== 0) {
                    setCurrentPdfIndex(currentPdfIndex - 1);
                    setFIVCurrentItem(fiv_item_array[currentPdfIndex]);
                  }
                }}
              />
              <p>
                {" "}
                <span> {currentPdfIndex + 1}</span>/{" "}
                <span>{fiv_item_array?.length}</span>
              </p>
              <ChevronRight
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  if (currentPdfIndex < fiv_item_array?.length - 1) {
                    setCurrentPdfIndex(Number(currentPdfIndex) + 1);
                    setFIVCurrentItem(fiv_item_array[currentPdfIndex]);
                  }
                }}
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
                  onRenderSuccess={({ originalWidth, originalHeight }) => {
                    setPageDimensions({
                      width: originalWidth,
                      height: originalHeight
                    });
                    setFIVBoundingBoxes(boundingBoxes);
                  }}
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
    </>
  );
};

export default FIVPdfViewer;
