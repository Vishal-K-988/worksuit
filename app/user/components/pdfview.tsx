'use client'

import { useState, useEffect } from 'react';
import type { pdfjs as PDFJSType } from 'react-pdf';
import dynamic from 'next/dynamic';

// Dynamically import Document and Page components with ssr: false
// This ensures they are only loaded and rendered on the client side.
const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};

const maxWidth = 800;

type Props = {
  URL: string;
}

export const Pdfview = (props: Props) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to store error messages

const [pdfjsInstance, setPdfjsInstance] = useState<typeof PDFJSType | null>(null);

  // Effect to dynamically import pdfjs and set workerSrc on the client side
  useEffect(() => {
    const setupPdfjs = async () => {
      // Ensure this code runs only in the browser environment
      if (typeof window !== 'undefined') {
        try {
          // Use await with import() to get the module object
          const { pdfjs: loadedPdfjs } = await import('react-pdf');
          loadedPdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${loadedPdfjs.version}/build/pdf.worker.min.mjs`;
          setPdfjsInstance(loadedPdfjs); // Set the pdfjs instance to state
          console.log("pdfjs instance set:", loadedPdfjs);
        } catch (err) {
          console.error("Failed to load pdfjs worker:", err);
          setError("Failed to initialize PDF viewer. Please try again.");
          setIsLoading(false);
        }
      }
    };
    setupPdfjs();
  }, []); // Empty dependency array ensures this runs only once on mount

  function onDocumentSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false); // Set loading to false once document is loaded
    setError(null); // Clear any previous errors
  }

  function onDocumentError(err: Error) {
    console.error('Error loading PDF document:', err);
    // Provide a more user-friendly error message
    setError(`Failed to load PDF: ${err.message || 'Unknown error'}. Please ensure the PDF URL is correct and accessible.`);
    setIsLoading(false); // Also set loading to false on error
    setNumPages(null); // Reset numPages on error
  }

  const pdfUrl = props.URL || ""; // Use the URL passed via props

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 font-inter">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 rounded-md p-2 ">
       Signed Contract 
      </h1>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
        {isLoading && !error && (
          <div className="text-gray-600 text-lg mb-4">Loading PDF...</div>
        )}

        {error && (
          <div className="text-red-600 text-lg mb-4 p-3 border border-red-400 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {!isLoading && !error && numPages === null && (
          <div className="text-gray-600 text-lg mb-4">No PDF loaded or failed to load.</div>
        )}

        <div className="border border-gray-300 rounded-md overflow-hidden">
          {/* Render Document and Page only if pdfjsInstance is available and no error */}
          {pdfjsInstance && !error && (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentSuccess}
              onLoadError={onDocumentError}
              options={options}
              className="w-full h-auto" // Ensure the document container is responsive
            >
              <Page
                pageNumber={pageNumber}
                // Adjust page width responsively, considering a max width
                // window.innerWidth * 0.9 ensures it takes 90% of the viewport width
                width={typeof window !== 'undefined' ? Math.min(maxWidth, window.innerWidth * 0.9) : maxWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
          )}
        </div>

        {numPages && (
          <div className="flex items-center justify-center mt-6 space-x-4">
            <button
              onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
              disabled={pageNumber <= 1}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
            >
              Previous
            </button>
            <span className="text-lg font-medium text-gray-700">
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
              disabled={pageNumber >= numPages}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pdfview;