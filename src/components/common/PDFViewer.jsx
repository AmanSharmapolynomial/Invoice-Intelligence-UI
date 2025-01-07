import { useCallback, useEffect, useRef, useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import { Link, useLocation, useSearchParams } from "react-router-dom";

import download from "@/assets/image/download.svg";
import ocr from "@/assets/image/ocr.svg";
import rotate_left from "@/assets/image/rotate_left.svg";
import copy from "@/assets/image/copy.svg";
import rotate_right from "@/assets/image/rotate_right.svg";
import zoom_in from "@/assets/image/zoom_in.svg";
import zoom_out from "@/assets/image/zoom_out.svg";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useExtractOcrText } from "./api";

import {
  Box,
  ChevronLeft,
  ChevronRight,
  Copy,
  Lock,
  ScanSearch
} from "lucide-react";
import { Modal, ModalDescription } from "../ui/Modal";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PdfViewer = ({
  pdfUrls = [],
  children,
  image_rotations = [],
  showViewInvoiceItems,
  single = true,
  showIsBounding = false,
  showBorder = true,
  loaded = false,
  multiple = false,
  setLoaded = () => {},
  loadinMetadata
}) => {
  const {
    bounding_box,
    bounding_boxes,
    highlightAll,
    highlightRow,
    isModalOpen,
    setIsModalOpen
  } = invoiceDetailStore();
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);

  const pdfUrl = pdfUrls?.[currentPdfIndex];

  const iframeUrl = pdfUrl
    ? `${pdfUrl?.document_link?.replace(
        "uc?id=",
        "file/d/"
      )}/preview?embedded=true`
    : "";
  const { pathname } = useLocation();

  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [pdfScale, setPdfScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [text, setText] = useState("");

  const [lockZoomAndScroll, setLockZoomAndScroll] = useState(false);
  const [pageDimensions, setPageDimensions] = useState({ width: 0, height: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [viewImageModal, setViewImageModal] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [image, setImage] = useState(null);
  const [toggle, setToggle] = useState(false);
  const boundingBoxRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectPdfPortion, setSelectPdfPortion] = useState(false);
  const [searchParams] = useSearchParams();
  const updateParams = useUpdateParams();
  const [isDragging, setIsDragging] = useState(false);
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const { mutate, isPending } = useExtractOcrText();

  const handleLoad = () => setIsLoading(false);
  const handleError = (error) => {
    console.error("Error loading PDF:", error);
    setIsLoading(false);
  };
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoaded(true);
    setPageNum(1);
    setIsLoading(false);
  };

  const previousPage = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  const nextPage = () => {
    if (pageNum < numPages) setPageNum(pageNum + 1);
  };

  const onRenderSuccess = (page) => {
    const { originalWidth, originalHeight } = page;
    setPageDimensions({
      width: originalWidth,
      height: originalHeight
    });
    setLoaded(true);
  };

  useEffect(() => {
    if (bounding_box && bounding_box.page_index !== undefined) {
      const targetPageIndex = bounding_box.page_index;
      if (targetPageIndex + 1 !== pageNum) {
        setPageNum(targetPageIndex + 1);
      }
    }
  }, [bounding_box, pageNum, bounding_boxes]);

  const getBoundingBoxStyle = (width, height, bb, showBorder) => {
    let rotation = 0;

    if (image_rotations?.[`image_${pageNum - 1}`]?.image_rotated) {
      rotation = image_rotations?.[`image_${pageNum - 1}`]?.rotation_angle;
    }

    if (!bb?.box?.polygon || bb.box.polygon.length !== 4) return {};

    // Original points of the bounding box in normalized coordinates (0 to 1)
    const points = bb.box.polygon.map((point) => ({
      x: point.X * width,
      y: point.Y * height
    }));

    // Apply scaling factor to coordinates
    const scaledPoints = points.map((point) => ({
      x: point.x * pdfScale,
      y: point.y * pdfScale
    }));

    // Center of the image (rotation origin)
    const centerX =
      (width * pdfScale) / 2 - (rotation == -90 ? 123 * pdfScale : 0);
    const centerY =
      (height * pdfScale) / 2 + (rotation == 90 ? 122 * pdfScale : 0);

    // Rotate the points around the center of the page
    const rotatedPoints = scaledPoints.map((point) => {
      const x = point.x - centerX;
      const y = point.y - centerY;

      const rotatedX =
        x * Math.cos((-rotation * Math.PI) / 180) -
        y * Math.sin((-rotation * Math.PI) / 180);
      const rotatedY =
        x * Math.sin((-rotation * Math.PI) / 180) +
        y * Math.cos((-rotation * Math.PI) / 180);

      return {
        x: rotatedX + centerX,
        y: rotatedY + centerY
      };
    });

    // Get new bounding box coordinates (top-left and bottom-right)
    const topLeft = rotatedPoints[0];
    const bottomRight = rotatedPoints[2];

    const calculatedWidth = bottomRight.x - topLeft.x;
    const calculatedHeight = bottomRight.y - topLeft.y;

    return {
      position: "absolute",
      top: `${topLeft.y}px`,
      left: `${topLeft.x}px`,
      width: `${calculatedWidth}px`,
      height: `${calculatedHeight}px`,
      background: "rgba(144,238,144,0.4)",
      zIndex: 9999,
      borderRadius: 5,
      paddingLeft: 10,
      paddingRight: 5,
      border: showBorder ? "1.5px solid red" : undefined
    };
  };

  const zoomToBoundingBox = (width, height, bb) => {
    let rotation = 0;
    if (image_rotations?.[`image_${pageNum - 1}`]?.image_rotated) {
      rotation = image_rotations?.[`image_${pageNum - 1}`]?.rotation_angle;
    }

    const viewerElement = document.getElementById("react-pdf__Wrapper");
    if (!bb?.box?.polygon || bb?.box?.polygon?.length !== 4) {
      if (!lockZoomAndScroll && pdfScale === 1.0) {
        setPdfScale(1);
        viewerElement?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
      return;
    }

    const viewerWidth = viewerElement.clientWidth;
    const viewerHeight = viewerElement.clientHeight;

    // Calculate the width and height of the bounding box in the original coordinates
    const boxWidth = (bb.box.polygon[2].X - bb.box.polygon[0].X) * width;
    const boxHeight = (bb.box.polygon[2].Y - bb.box.polygon[0].Y) * height;

    // Calculate the target scale based on the bounding box size and viewer size
    const targetScale = lockZoomAndScroll
      ? pdfScale
      : Math.min(viewerWidth / boxWidth, viewerHeight / boxHeight, 3.0) * 0.9;

    setPdfScale(targetScale < 1 ? 1 : targetScale);

    // Calculate the top-left position of the bounding box in the scaled viewer coordinates
    const topLeftX = bb.box.polygon[0].X * width * targetScale;
    const topLeftY = bb.box.polygon[0].Y * height * targetScale;

    // Center of the image (rotation origin) after scaling
    const centerX = (width * targetScale) / 3;
    const centerY = (height * targetScale) / 2;

    // Rotate the top-left point back to its original position based on the rotation angle
    const adjustedTopLeftX =
      Math.cos((-rotation * Math.PI) / 180) * (topLeftX - centerX) -
      Math.sin((-rotation * Math.PI) / 180) * (topLeftY - centerY) +
      centerX;
    const adjustedTopLeftY =
      Math.sin((-rotation * Math.PI) / 180) * (topLeftX - centerX) +
      Math.cos((-rotation * Math.PI) / 180) * (topLeftY - centerY) +
      centerY;

    // Calculate the new scroll position to center the bounding box in the viewer
    const scrollLeft =
      adjustedTopLeftX - viewerWidth / 2 + (boxWidth * targetScale) / 2;
    const scrollTop =
      adjustedTopLeftY - viewerHeight / 2 + (boxHeight * targetScale) / 2;

    // Scroll to the calculated position with smooth behavior
    viewerElement.scrollTo({
      left: scrollLeft,
      top: scrollTop,
      behavior: "smooth"
    });
  };

  let page = searchParams.get("page_number");

  useEffect(() => {
    if (bounding_boxes?.length == 0 && !lockZoomAndScroll) {
      setPdfScale(1.0);
    }
  }, [bounding_box, bounding_boxes, page]);

  useEffect(() => {
    setLockZoomAndScroll(false);
    setPdfScale(1.0);
  }, [page]);
  useEffect(() => {
    setPdfScale(1.0);
  }, []);

  useEffect(() => {
    if (pageDimensions.width && pageDimensions.height) {
      if (!highlightAll && bounding_box) {
        zoomToBoundingBox(
          pageDimensions.width,
          pageDimensions.height,
          bounding_box
        );
      }
    }
  }, [
    bounding_box,
    pageDimensions,
    pageNum,
    highlightAll,
    bounding_boxes,
    highlightRow
  ]);

  const previousPdf = () => {
    if (currentPdfIndex > 0) {
      setCurrentPdfIndex(currentPdfIndex - 1);
    }
  };

  const nextPdf = () => {
    if (currentPdfIndex < pdfUrls.length - 1) {
      setCurrentPdfIndex(currentPdfIndex + 1);
    }
  };

  const handleMouseDown = (e) => {
    if (!selectPdfPortion) {
      return;
    }
    const pdfWrapper = document.getElementById("react-pdf__Wrapper");
    const rect = pdfWrapper.getBoundingClientRect();
    const scrollX = pdfWrapper.scrollLeft;
    const scrollY = pdfWrapper.scrollTop;

    setIsSelecting(true);
    setStartX(e.clientX - rect.left + scrollX);
    setStartY(e.clientY - rect.top + scrollY);
  };

  const handleMouseMove = (e) => {
    if (!selectPdfPortion) {
      return;
    }
    if (isSelecting) {
      const pdfWrapper = document.getElementById("react-pdf__Wrapper");
      const rect = pdfWrapper.getBoundingClientRect();
      const scrollX = pdfWrapper.scrollLeft;
      const scrollY = pdfWrapper.scrollTop;

      setEndX(e.clientX - rect.left + scrollX);
      setEndY(e.clientY - rect.top + scrollY);
    }
  };

  const handleMouseUp = () => {
    if (!selectPdfPortion) {
      return;
    }
    setIsSelecting(false);

    if (Math.abs(startX - endX) < 10 || Math.abs(startY - endY) < 10) {
      return;
    }

    captureSelectedArea();
  };
  const captureSelectedArea = () => {
    const canvas = document.createElement("canvas");
    const pdfCanvas = document.querySelector(".react-pdf__Page__canvas");

    const scaleFactor = pdfCanvas.width / pdfCanvas.offsetWidth;

    canvas.width = Math.abs(endX - startX) * scaleFactor;
    canvas.height = Math.abs(endY - startY) * scaleFactor;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      pdfCanvas,
      Math.min(startX, endX) * scaleFactor,
      Math.min(startY, endY) * scaleFactor,
      Math.abs(endX - startX) * scaleFactor,
      Math.abs(endY - startY) * scaleFactor,
      0,
      0,
      canvas.width,
      canvas.height
    );
    const base64Image = `data:image/png;base64,${
      canvas.toDataURL("image/png").split(",")[1]
    }`;
    setImage(base64Image);

    const formData = new FormData();
    setText("");
    canvas.toBlob((blob) => {
      formData.append("image", blob, "selected_area.png");
      mutate(formData, {
        onSuccess: (data) => {
          setText(data?.data?.text);
        }
      });
      setIsModalOpen(true);
    }, "image/png");
    setIsSelecting(false);
    setStartX(0);
    setStartY(0);
    setEndX(0);
    setEndY(0);
  };
  useEffect(() => {
    if (image_rotations) {
      const currentImageKey = `image_${pageNum - 1}`;
      const currentImage = image_rotations[currentImageKey];

      if (currentImage) {
        if (currentImage.image_rotated) {
          let rotatedAngle = currentImage.rotation_angle;
          // Normalize rotation angle to the range [0, 360)
          const normalizedAngle = ((rotatedAngle % 360) + 360) % 360;

          // Determine the rotation to make the page upright (portrait)
          let portraitRotation;
          switch (normalizedAngle) {
            case 90:
              portraitRotation = 270; // Rotate clockwise to upright
              break;
            case 270:
              portraitRotation = 90; // Rotate counterclockwise to upright
              break;
            case 180:
              portraitRotation = 180; // Flip upside down
              break;
            default:
              portraitRotation = 0; // Already upright
          }

          setRotation(portraitRotation);
        } else {
          setRotation(0); // Default to no rotation
        }
      }
    }
  }, [pageNum, image_rotations, setPageNum]);

  const handleWheel = (event) => {
    if (event.shiftKey) {
      event.preventDefault();
      const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
      setPdfScale((prevScale) => {
        const newScale = prevScale * scaleFactor;
        return Math.min(Math.max(newScale, 0.1), 8);
      });
    }
  };
  const handleDragStart = useCallback((e) => {
    if (isSelecting) {
      setIsDragging(false);
      return;
    }
    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true);
      setStartDragPosition({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleDragMove = useCallback(
    (e) => {
      if (isSelecting) {
        setIsDragging(false);
        return;
      }
      if (isDragging && pdfWrapperRef.current) {
        const dx = e.clientX - startDragPosition.x;
        const dy = e.clientY - startDragPosition.y;
        pdfWrapperRef.current.scrollLeft -= dx;
        pdfWrapperRef.current.scrollTop -= dy;
        setStartDragPosition({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, startDragPosition]
  );
  const pdfWrapperRef = useRef(null);

  const handleDragEnd = useCallback(() => {
    if (isSelecting) {
      setIsDragging(false);
      return;
    }
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const pdfWrapper = pdfWrapperRef.current;
    if (pdfWrapper) {
      // pdfWrapper.addEventListener("wheel", handleZoomWheel, { passive: false });
      pdfWrapper.addEventListener("mousedown", handleDragStart);
      window.addEventListener("mousemove", handleDragMove);
      window.addEventListener("mouseup", handleDragEnd);
      return () => {
        // pdfWrapper.removeEventListener("wheel", handleZoomWheel);
        pdfWrapper.removeEventListener("mousedown", handleDragStart);
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
      };
    }
  }, [handleDragStart, handleDragMove, handleDragEnd, pdfUrls]);

  useEffect(() => {
    const pdfWrapper = document.getElementById("react-pdf__Wrapper");
    if (pdfWrapper) {
      pdfWrapper.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        pdfWrapper.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  return (
    <div className="w-full  max-h-[42rem] overflow-auto  hide-scrollbar">
      {loadinMetadata && <Skeleton className={"w-[50rem]  h-[60rem]"} />}
      {(pdfUrls[currentPdfIndex]?.document_source == "azure_blob" ||
        pdfUrls[currentPdfIndex]?.document_source == "clickbacon") && (
        <div className="flex justify-center my-2 border-t border-t-[#E7E7E7] border-r-[#E7E7E7] border-b h-10 items-center ">
          {multiple && (
            <div className="border-2">
              {pdfUrls?.length > 1 && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    disabled={currentPdfIndex <= 0}
                    onClick={previousPdf}
                    className="px-5"
                  >
                    Previous
                  </Button>

                  <Button
                    size="sm"
                    disabled={currentPdfIndex >= pdfUrls.length - 1}
                    onClick={nextPdf}
                    className="px-5"
                  >
                    Next
                  </Button>
                </>
              )}
            </div>
          )}

          {showViewInvoiceItems && (
            <>
              <Button
                variant="success"
                size="sm"
                className="px-5"
                onClick={() => {
                  if (searchParams.get("document_uuid")) {
                    updateParams({
                      document_uuid: undefined
                    });
                  } else {
                    updateParams({
                      document_uuid: pdfUrls[currentPdfIndex]?.document_uuid
                    });
                  }
                  setToggle(!toggle);
                }}
              >
                {searchParams.get("document_uuid")
                  ? "Item"
                  : "View Invoice Items"}
              </Button>
              <Link
                target="_blank"
                to={`/invoice-details?document_uuid=${pdfUrls[currentPdfIndex]?.document_uuid}`}
              >
                <Button size="sm" className="px-5" variant="info">
                  {" "}
                  Invoice
                </Button>
              </Link>
            </>
          )}

          <div className="flex items-center gap-x-8 ">
            <img
              src={rotate_left}
              alt=""
              className="cursor-pointer h-5 w-5"
              onClick={() => setRotation(rotation === 0 ? 270 : rotation - 90)}
            />
            <img
              src={rotate_right}
              alt=""
              className="cursor-pointer h-5 w-5"
              onClick={() => setRotation(rotation === 0 ? 270 : rotation + 90)}
            />
            <ScanSearch
              className={`cursor-pointer h-6 w-6 ${
                selectPdfPortion ? "text-primary" : "text-[#000000]"
              }`}
              onClick={() => setSelectPdfPortion(!selectPdfPortion)}
            />
            <img
              src={zoom_in}
              alt=""
              className="cursor-pointer h-5 w-5"
              onClick={() => {
                if (pdfScale <= 8) {
                  setPdfScale(pdfScale * 2);
                }
              }}
            />
            <img
              src={zoom_out}
              alt=""
              className="cursor-pointer h-5 w-5"
              onClick={() => {
                if (!pdfScale <= 0.1) {
                  setPdfScale(pdfScale / 2);
                }
              }}
            />
            <img
              src={download}
              alt=""
              className="cursor-pointer h-5 w-5"
              onClick={() => window.open(pdfUrl?.document_link, "_blank")}
            />
            <ChevronLeft
              className="cursor-pointer h-6 w-6"
              onClick={previousPage}
            />
            <ChevronRight
              className="cursor-pointer h-6 w-6"
              onClick={nextPage}
            />
            {/* <button
              type="button"
              disabled={pageNum <= 1}
              onClick={previousPage}
              className="btn btn-sm btn-outline-secondary"
            >
              Previous Page
            </button> */}
            {/* Next page button */}
            {/* <button
              type="button"
              disabled={pageNum >= numPages}
              onClick={nextPage}
              className="btn btn-sm btn-outline-secondary"
            >
              Next Page
            </button>
          */}

            <div>
              <span className="text-center font-poppins font-medium text-[0.9rem]">
                Page {pageNum} / {numPages || pageNum}
              </span>
            </div>

            <Lock
              height={20}
              width={20}
              className="cursor-pointer"
              onClick={() => setLockZoomAndScroll(!lockZoomAndScroll)}
              style={{
                color: lockZoomAndScroll ? "green" : "black"
              }}
            />
            <>
              {/* <Box
                height={20}
                width={20}
                className="cursor-pointer mx-2"
                onClick={() => setSelectPdfPortion(!selectPdfPortion)}
                style={{
                  color: selectPdfPortion ? "green" : "black"
                }}
              /> */}
              {showIsBounding && (
                <>
                  {pdfUrl?.is_bounding_box_exist ? (
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <span>Bounding Box:</span>
                      <span
                        style={{
                          height: 15,
                          width: 15,
                          borderRadius: 50,
                          background: "green"
                        }}
                      />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <span>Bounding Box:</span>
                      <span
                        style={{
                          height: 15,
                          width: 15,
                          borderRadius: 50,
                          background: "green"
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </>

            {children}
          </div>
        </div>
      )}
      {/* PDF Viewer Wrapper */}
      {pdfUrls[currentPdfIndex]?.document_source !== undefined &&
        (pdfUrls[currentPdfIndex]?.document_source == "azure_blob" ||
        pdfUrls[currentPdfIndex]?.document_source == "clickbacon" ? (
          <div
            id="react-pdf__Wrapper"
            ref={pdfWrapperRef}
            style={{
              height: "65vh",
              overflow: "auto",
              maxWidth: "100%",
              position: "relative"
            }}
            className="flex show-scrollbar custom-scrollbar "
          >
            {pdfUrl ? (
              <Document
                onWheel={handleWheel}
                file={pdfUrls[currentPdfIndex]?.document_link}
                onLoadSuccess={onDocumentLoadSuccess}
                className={"active:cursor-grabbing"}
              >
                <Page
                  pageNumber={pageNum}
                  onRenderSuccess={onRenderSuccess}
                  scale={pdfScale}
                  rotate={rotation}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  renderTextLayer={false}
                >
                  {isSelecting && (
                    <div
                      style={{
                        position: "absolute",
                        left: Math.min(startX, endX),
                        top: Math.min(startY, endY),
                        width: Math.abs(endX - startX),
                        height: Math.abs(endY - startY),
                        border: "2px dashed #000000",
                        backgroundColor: "rgba(99, 189, 255, 0.2)"
                      }}
                    />
                  )}
                  {highlightAll ? (
                    bounding_boxes
                      ?.filter((bb) => bb.page_index + 1 == pageNum)
                      .map((bb, idx) => (
                        <div
                          key={idx}
                          style={getBoundingBoxStyle(
                            pageDimensions.width,
                            pageDimensions.height,
                            bb,
                            false
                          )}
                        ></div>
                      ))
                  ) : (
                    <>
                      {bounding_boxes
                        ?.filter((bb) => bb.page_index + 1 == pageNum)
                        .map((bb, idx) => (
                          <div
                            key={idx}
                            style={getBoundingBoxStyle(
                              pageDimensions.width,
                              pageDimensions.height,
                              bb,
                              false
                            )}
                          ></div>
                        ))}
                      <div
                        style={getBoundingBoxStyle(
                          pageDimensions.width,
                          pageDimensions.height,
                          bounding_box,
                          true
                        )}
                      ></div>
                    </>
                  )}
                </Page>
                {/* <img src={image} alt="" /> */}
              </Document>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%"
                }}
              >
                <></>
              </div>
            )}
          </div>
        ) : (
          <>
            {loaded && (
              <iframe
                title="pdf"
                src={iframeUrl}
                onLoad={handleLoad}
                onError={handleError}
                width="100%"
                height="570"
                allow="autoplay"
                style={{ display: isLoading ? "none" : "block" }} // Hide iframe while loading
              />
            )}
            {isLoading || !loaded ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  height: "580px"
                }}
              ></div>
            ) : (
              <></>
            )}{" "}
          </>
        ))}
      {/* Modal for future use */}

      <Modal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        title={"Selected Area"}
        className="!max-h-[35rem] !max-w-[45rem] "
        iconCN={"mt-1.5"}
        titleClassName={
          "font-poppins font-medium mt-2 flex justify-center text-base leading-5 text-[#000000]"
        }
      >
        <ModalDescription className="w-full border  ">
          <div className="mt-2 m-0 flex flex-col gap-y-2 relative">
            <p className="font-poppins !text-[#000000] font-medium text-sm px-1">
              Extracted Text
            </p>
            {isPending ? (
              <>
                <Skeleton className={"w-[50rem] bg-primary/30 h-[10rem]"} />
              </>
            ) : (
              <Textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
                className="bg-[#F6F6F6] !max-w-full font-poppins  font-normal text-xs !text-[#000000] focus:!outline-none focus:!ring-0 !relative"
                rows={10}
              ></Textarea>
            )}

            {!isPending && (
              <img
                src={copy}
                alt="copy icon"
                onClick={() => {
                  navigator.clipboard.writeText(text);
                  toast.success("Text copied to clipboard");
                }}
                className="absolute right-3  top-10 cursor-pointer h-4  z-50"
              />
            )}
            <div className="flex justify-center  p-2 mt-8 rounded  border-white shadow-sm">
              {image && (
                <img
                  src={image}
                  alt="selected area"
                  className="max-h-[20rem] object-center"
                  onError={() => console.error("Image failed to load")}
                />
              )}
            </div>
          </div>
        </ModalDescription>
      </Modal>
    </div>
  );
};
