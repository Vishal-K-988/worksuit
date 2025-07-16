'use client'

import { useState } from 'react';
import dynamic from 'next/dynamic';



const Document = dynamic(
  () => import('react-pdf').then((mod) => mod.Document),
  { ssr: false }
);

const Page = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

// We also need to set the workerSrc only on the client side.
// This will be done inside a useEffect hook.
let pdfjs;
if (typeof window !== 'undefined') {
  pdfjs = require('react-pdf').pdfjs;
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  console.log("pdfjs : ", pdfjs) 
  console.log("type of pdfjs : " , typeof(pdfjs))
}

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

type Props = {
    URL : string
}





export const Pdfview  =(props : Props )  => {
    const [pagenumber , setPagenumber] = useState(1);
    const [numPages, setnumPages] = useState(null)
      const [isLoading, setIsLoading] = useState(true); // State to manage loading


   
  function onDocumentSuccess({ numPages }) {
    setnumPages(numPages);
    setIsLoading(false); // Set loading to false once document is loaded
    
  }

  function onDocumentError(error) {
    console.error('Error loading PDF document:', error);
    setIsLoading(false); // Also set loading to false on error
  }

        const pdfUrl = props.URL || ""; // Replace with your PDF URL
    

    

    
    return (<>
     <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100 font-inter">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 rounded-md p-2 bg-white shadow-md">
        PDF Viewer
      </h1>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
        {isLoading && (
          <div className="text-gray-600 text-lg mb-4">Loading PDF...</div>
        )}

        {!isLoading && numPages === null && (
          <div className="text-red-600 text-lg mb-4">Failed to load PDF. Please try again.</div>
        )}

        <div className="border border-gray-300 rounded-md overflow-hidden">
          {/* Render Document and Page only if pdfjs is available (client-side) */}
          {pdfjs   && (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentSuccess}
              onLoadError={onDocumentError}
              options={options}
              className="w-full h-auto" // Ensure the document container is responsive
            >
              <Page
                pageNumber={pagenumber}
                width={Math.min(maxWidth, window.innerWidth * 0.9)} // Adjust page width responsively
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
          )}
        </div>

        {numPages && (
          <div className="flex items-center justify-center mt-6 space-x-4">
            <button
              onClick={() => setPagenumber(prev => Math.max(1, prev - 1))}
              disabled={pagenumber <= 1}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
            >
              Previous
            </button>
            <span className="text-lg font-medium text-gray-700">
              Page {pagenumber} of {numPages}
            </span>
            <button
              onClick={() => setPagenumber(prev => Math.min(numPages, prev + 1))}
              disabled={pagenumber >= numPages}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
    </>)
}

export default Pdfview
