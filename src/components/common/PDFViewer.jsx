import { useEffect, useRef, useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import { Link, useLocation, useSearchParams } from "react-router-dom";

import download from "@/assets/image/download.svg";
import ocr from "@/assets/image/ocr.svg";
import rotate_left from "@/assets/image/rotate_left.svg";
import rotate_right from "@/assets/image/rotate_right.svg";
import zoom_in from "@/assets/image/zoom_in.svg";
import zoom_out from "@/assets/image/zoom_out.svg";
import useUpdateParams from "@/lib/hooks/useUpdateParams";
import { invoiceDetailStore } from "@/store/invoiceDetailStore";
import { useExtractOcrText } from "./api";

import { Box, ChevronLeft, ChevronRight, Lock, ScanSearch } from "lucide-react";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PdfViewer = ({
  pdfUrls = [],
  children,
  showViewInvoiceItems,
  single = true,
  showIsBounding = false,
  showBorder = true,
  loaded = false,
  multiple = false,
  setLoaded = () => {}
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

  const getBoundingBoxStyle = (width, height, bb, showBorderr) => {
    if (!bb?.box?.polygon || bb.box.polygon.length !== 4) return {};

    const topLeft = {
      x: bb.box.polygon[0].X * width * pdfScale,
      y: bb.box.polygon[0].Y * height * pdfScale
    };
    const bottomRight = {
      x: bb.box.polygon[2].X * width * pdfScale,
      y: bb.box.polygon[2].Y * height * pdfScale
    };

    const calculatedWidth = bottomRight.x - topLeft.x;
    const calculatedHeight = bottomRight.y - topLeft.y;

    return {
      position: "absolute",
      top: `${topLeft.y - 1}px`,
      left: `${topLeft.x}px`,
      width: `${calculatedWidth}px`,
      height: `${calculatedHeight + 4}px`,
      background: "rgba(144,238,144,0.4)",
      zIndex: 9999,
      borderRadius: 5,
      paddingLeft: 10,
      paddingRight: 5,
      border: showBorderr && showBorder ? "1.5px solid red" : undefined
    };
  };

  const zoomToBoundingBox = (width, height, bb) => {
    const viewerElement = document.getElementById("react-pdf__Wrapper");
    if (!bb?.box?.polygon || bb?.box?.polygon?.length !== 4) {
      if (!lockZoomAndScroll && pdfScale === 1.0) {
        setPdfScale(1.0);
        viewerElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
      return;
    }

    const viewerWidth = viewerElement.clientWidth;
    const viewerHeight = viewerElement.clientHeight;

    const boxWidth = (bb.box.polygon[2].X - bb.box.polygon[0].X) * width;
    const boxHeight = (bb.box.polygon[2].Y - bb.box.polygon[0].Y) * height;

    const targetScale = lockZoomAndScroll
      ? pdfScale
      : Math.min(viewerWidth / boxWidth, viewerHeight / boxHeight, 3.0) * 0.7;

    setPdfScale(targetScale < 0 ? 1 : targetScale);

    const topLeftX = bb.box.polygon[0].X * width * targetScale;
    const topLeftY = bb.box.polygon[0].Y * height * targetScale;

    viewerElement.scrollTo({
      left: topLeftX - viewerWidth / 2 + (boxWidth * targetScale) / 2,
      top: topLeftY - viewerHeight / 2 + (boxHeight * targetScale) / 2,
      behavior: "smooth"
    });
    // setPdfScale(1.0)
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

  return (
    <div className="w-full ">
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
            <ScanSearch className={`cursor-pointer h-6 w-6 ${selectPdfPortion?"text-primary":"text-[#000000]"}`} onClick={() => setSelectPdfPortion(!selectPdfPortion)}/>
          <img
              src={zoom_in}
              alt=""
              className="cursor-pointer h-5 w-5"
              onClick={() => {
                if (lockZoomAndScroll || pdfScale >= 8) {
                } else {
                  setPdfScale(pdfScale * 2);
                }
              }}
            />
            <img
              src={zoom_out}
              alt=""
              className="cursor-pointer h-5 w-5"
              onClick={() => {
                if (lockZoomAndScroll || pdfScale <= 0.1) {
                } else {
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
            <ChevronLeft className="cursor-pointer h-6 w-6"  onClick={previousPage}/>
            <ChevronRight className="cursor-pointer h-6 w-6"  onClick={nextPage} />
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
              <span className="text-center font-poppins font-medium text-sm">
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
            style={{
              height: "65vh",
              overflow: "auto",
              maxWidth: "100%",
              position: "relative"
            }}
            className="flex justify-center"
          >
            {pdfUrl ? (
              <Document
                file={pdfUrls[currentPdfIndex]?.document_link}
                onLoadSuccess={onDocumentLoadSuccess}
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
                        border: "2px dashed blue",
                        backgroundColor: "rgba(0, 0, 255, 0.1)"
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

      {/* <Modal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Selected Area</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isPending ? (
            <div
              className="d-flex justify-content-center align-items-center w-100 "
              style={{ height: "400px" }}
            >
              <Spinner />
            </div>
          ) : (
            <>
              <div className="border p-2 rounded mb-2 border-white shadow-sm">
                <div className="d-flex justify-content-between mb-2">
                  <h5 className="text-bold m-0">Extracted Text</h5>
                  <Clipboard2Fill
                    height={20}
                    width={20}
                    className="cursor-pointer"
                    fill="green"
                    onClick={() => {
                      navigator.clipboard.writeText(text);
                      toast.info("Text copied to clipboard");
                    }}
                  />
                </div>
                <textarea
                  className="form-control"
                  rows="10"
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                />
              </div>
              <div className="d-flex justify-content-center border p-2 rounded mb-2 border-white shadow-sm">
                {image && (
                  <img
                    src={image}
                    alt="selected area"
                    width={500}
                    onError={() => console.error("Image failed to load")}
                  />
                )}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal> */}
    </div>
  );
};
