import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { useState, useCallback } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { getFilenameFromUrl, type PDFDocumentProxy } from "pdfjs-dist";

import {
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Close,
} from "./icons.component";

//  support site
// https://github.com/wojtekmaj/react-pdf

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const maxWidth = 900;

// https://stackoverflow.com/questions/66669644/react-pdf-slow-rendering-when-using-scale-prop-in-page-component

//const resizeObserverOptions = { useResizeObserver };
const resizeObserverOptions = {};
const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

type pdf = { pdfurl: string; setParentState: () => void; key: string };

const PDFGenerator = ({ pdfurl, setParentState, key }: pdf) => {
  const [numPages, setNumPages] = useState<number>();
  // const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [url, setUrl] = useState<string>(pdfurl);
  const [showPublication, setShowPublication] = useState(true);
  const [zoom, setZoom] = useState<number>(1);
  const filename = getFilenameFromUrl(pdfurl);
  const idx = url.indexOf(filename);
  const newUrl = url.substring(10, idx);

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setShowPublication(true);
    setNumPages(nextNumPages);
    setZoom(1);
  }

  const handlePdfClose = () => {
    setShowPublication(false);
    setParentState();
  };

  // type ZoomLevel = 1 | 2 | 3;
  // const handlePdfScaleUp = (scale: ZoomLevel) => {};

  const handlePdfZoomIn = () => {
    zoom.toFixed(1);
    let num = 0;
    num.toFixed(1);
    if (zoom < 1) {
      setZoom(1);
    }

    let increaseValue = 0.5;
    increaseValue.toFixed(1);

    num = zoom + increaseValue;
    setZoom(num);

    if (zoom >= increaseValue * 4) {
      setZoom(1);
    }
  };

  const handlePdfZoomOut = () => {
    zoom.toFixed(1);
    let num = 0.0;
    num.toFixed(1);
    let reduceValue = 0.2;
    reduceValue.toFixed(1);

    num = zoom - reduceValue;
    setZoom(num);

    if (zoom <= reduceValue * 2) {
      setZoom(0.8);
    }
  };

  return (
    <>
      {showPublication && (
        <>
          <div className="pdf_header">
            <div className="pdf_container">
              <div
                className="pdf_container_document absolute top-0 left-4 z-50 bg-[#d3d3d3] flex m-auto justify-center w-[100%]"
                ref={setContainerRef}

                // onResize={() => onResize}
              >
                <div className="flex flex-col grow m-auto bg-[#d3d3d3]">
                  <div className="flex justify-end flex-grow">
                    <label
                      className="flex pt-2"
                      onClick={() => handlePdfClose()}
                    >
                      <Close cssstyle="w-[1em] h-[1em]" />
                    </label>
                    <div className="hidden md:flex">
                      <label
                        className="flex px-3 pt-2 text1-red-600 bg1-red-600"
                        onClick={() => handlePdfZoomIn()}
                      >
                        <MagnifyingGlassPlus cssstyle="w-[1em] h-[1em]" />
                      </label>
                      <label
                        className="flex pr-2 pt-2"
                        onClick={() => handlePdfZoomOut()}
                      >
                        <MagnifyingGlassMinus cssstyle="w-[1em] h-[1em]" />
                      </label>
                    </div>
                  </div>
                  <Document
                    className="flex flex-col grow m-auto"
                    file={require("../assets/" + `${newUrl}` + filename)}
                    onLoadSuccess={onDocumentLoadSuccess}
                    options={options}
                  >
                    {Array.from(new Array(numPages), (_el, index) => (
                      <Page
                        pageNumber={index + 1}
                        // pageNumber={pageNumber}
                        width={
                          containerWidth
                            ? Math.min(containerWidth, maxWidth)
                            : maxWidth
                        }
                        scale={zoom}
                      />
                    ))}
                  </Document>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PDFGenerator;
