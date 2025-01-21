import { useCallback, useEffect, useRef, useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import { Link, useLocation, useSearchParams } from "react-router-dom";

import copy from "@/assets/image/copy.svg";
import download from "@/assets/image/download.svg";
import rotate_left from "@/assets/image/rotate_left.svg";
import rotate_right from "@/assets/image/rotate_right.svg";
import zoom_in from "@/assets/image/zoom_in.svg";
import zoom_out from "@/assets/image/zoom_out.svg";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useExtractOcrText } from "./api";

import { ChevronLeft, ChevronRight, Lock, ScanSearch } from "lucide-react";
import toast from "react-hot-toast";
import ResizableModal from "../ui/Custom/ResizeableModal";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";
import CustomDropDown from "../ui/CustomDropDown";
import { Button } from "../ui/button";
import { queryClient } from "@/lib/utils";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const fieldOptions = [
  {
    label: "Invoice Number",
    value: "invoice_number"
  },
  {
    label: "Credit Card Name",
    value: "credit_card_name"
  },
  {
    label: "Credit Card Number",
    value: "credit_card_number"
  },
  {
    label: "Invoice Shipped To",
    value: "invoice_ship_to"
  },
  {
    label: "Invoice Billed To",
    value: "invoice_bill_to"
  },
  {
    label: "Invoice Sold To",
    value: "invoice_sold_to"
  }
];
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
  loadinMetadata,

  payload
}) => {
  const {
    bounding_box,
    bounding_boxes,
    highlightAll,
    highlightRow,
    isModalOpen,
    setIsModalOpen,
    setAllowModalDragging,
    showTextExtractionModal,
    setShowTextExtractionModal,
    setUpdatedFields,
    metadataTableCopy: data
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
  const [selectedField, setSelectedField] = useState(null);
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
      : Math.min(viewerWidth / boxWidth, viewerHeight / boxHeight, 3.0) * 0.7;

    setPdfScale(targetScale < 1 ? 1 : targetScale);

    // Calculate the top-left position of the bounding box in the scaled viewer coordinates
    const topLeftX = bb.box.polygon[0].X * width * targetScale;
    const topLeftY = bb.box.polygon[0].Y * height * targetScale;

    // Center of the image (rotation origin) after scaling
    const centerX = (width * targetScale) / 2.0;
    const centerY =
      (height * targetScale) /
      (pdfScale == 2 ? 1.25 : pdfScale == 1.5 ? 1.5 : 2);

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
    e.stopPropagation();
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
         
          setText(data?.data?.text?.split("\n")?.join(""));
        }
      });
      setIsModalOpen(true);
      setAllowModalDragging(true);
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

  const handleInsertExtractedText = (setFields = true) => {

    if(!text){
      toast("Empty Extracted Text.",{
        icon:"⚠️"
      })
      return
    }

    if(!selectedField){
      toast("Empty Field Name . Please select field name to insert text. ",{
        icon:"⚠️"
      })
      return
    }
    let normalizedData = Array.isArray(data?.data) ? data?.data : [data?.data];
    let updated = false;
    let isDocumentMetadata = false;
    normalizedData.forEach((item, index) => {
      if (item?.document_metadata?.hasOwnProperty(selectedField)) {
        normalizedData[index].document_metadata[selectedField] = text;
        isDocumentMetadata = true;
        updated = true;
      } else if (item?.hasOwnProperty(selectedField)) {
        normalizedData[index][selectedField] = text;

        updated = true;
      }
    });
    let updatedData = Array.isArray(data?.data)
      ? { ...data, data: normalizedData }
      : { ...data, data: normalizedData[0] };
    queryClient.setQueryData(["document-metadata", payload], updatedData);
    if (updated) {
      if (setFields) {
        setUpdatedFields((prevFields) => {
          if (isDocumentMetadata) {
            return {
              ...prevFields,
              document_metadata: {
                ...prevFields.document_metadata,
                [selectedField]: text
              }
            };
          }
          return {
            ...prevFields,
            [selectedField]: text
          };
        });
      }
    }

    // if (key === "invoice_type" || key === "document_type") {
    //   setShowToChangeCategoriesAndTypes(true);
    // }
  };

  useEffect(() => {
    setUpdatedFields([]);
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
                showTextExtractionModal ? "text-primary" : "text-[#000000]"
              }`}
              onClick={() => {
                setSelectPdfPortion(!selectPdfPortion);
                setShowTextExtractionModal(!showTextExtractionModal);
              }}
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

      <ResizableModal
        isOpen={showTextExtractionModal}
        onClose={() => {
          setShowTextExtractionModal(!showTextExtractionModal);
          setText("");
          setSelectPdfPortion(!selectPdfPortion);
          setSelectedField(null)
        }}
      >
        <div className="flex items-start gap-x-2 h-full flex-col">
          <div className="mt-2 m-0 flex flex-col gap-y-2 relative">
            <div className="flex justify-between items-center">
              <p className="font-poppins !text-[#000000] font-medium text-sm px-1">
                Select Field To Insert The Extracted Text
              </p>
            </div>

            <div className="flex items-center gap-x-2">
              <CustomDropDown
                data={fieldOptions}
                Value={selectedField}
                triggerClassName={"!min-w-72"}
                contentClassName={""}
                onChange={(v) => setSelectedField(v)}
              />
              <Button
                onClick={handleInsertExtractedText}
                className="rounded-sm !h-[2.5rem] font-normal font-poppins text-white text-sm w-[5rem]"
              >
                Insert
              </Button>
            </div>
          </div>
          <div className="mt-2 m-0 w-full flex flex-col gap-y-2 relative">
            <div className="flex justify-between items-center">
              <p className="font-poppins !text-[#000000] font-medium text-sm px-1">
                Extracted Text
              </p>
              <p
                onClick={() => {
                  setText("");
                  setSelectedField(null)
                }}
                className="font-poppins !text-[#000000] font-normal cursor-pointer underline text-xs px-1"
              >
                Clear
              </p>
            </div>
            {isPending ? (
              <>
                <Skeleton className={"min-w-full bg-primary/30 h-[10rem]"} />
              </>
            ) : (
              <Textarea
                value={text}
                onChange={(e) => {
                  e.stopPropagation();
                  setText(e.target.value);
                }}
                className="bg-[#F6F6F6] !z-50 !max-w-full !min-h-full font-poppins  font-normal text-xs !text-[#000000] focus:!outline-none focus:!ring-0 !relative"
                rows={15}
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
          </div>
        </div>
      </ResizableModal>
    </div>
  );
};
