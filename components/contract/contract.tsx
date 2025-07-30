'use client'

import { useCallback, useEffect, useState } from 'react';
// Assuming these are your Convex imports for hooks
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api"; // Adjust path if necessary

import { PDF } from "@/app/user/components/pdfview";
import SignPreview from "@/app/user/components/signPreview";
import { addSignatureToPdf } from '@/app/user/utils/pdfUtils';

export default function Contract() {
  // Initial PDF URL can be null or a placeholder while the actual URL is fetched
  const initialPdfUrl = "/sample.pdf"; // Keep as a fallback or remove if always fetching

  // State to hold the dynamically fetched PDF URL
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(initialPdfUrl);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signaturePlacement, setSignaturePlacement] = useState<{ x: number; y: number; pageNumber: number } | null>(null);
  const [liveSignaturePreview, setLiveSignaturePreview] = useState<{ x: number; y: number; pageNumber: number } | null>(null);
  const [loading, setLoading] = useState(false); // For signature application
  const [pdfLoading, setPdfLoading] = useState(true); // New state for PDF fetching
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [totalPdfPages, setTotalPdfPages] = useState(1);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [reactPdfDimensions, setReactPdfDimensions] = useState<{ width: number; height: number } | null>(null);

  // Convex hooks
  // Fetch the S3 key from your Convex query
  const s3KeyFromConvex = useQuery(api.myFunctions.fetchS3Key);
  // Use the action to get the presigned URL
  const ViewPDFAction = useAction(api.myFunctions.ViewPDF);

  // useEffect to fetch the PDF URL when the component mounts or s3KeyFromConvex changes
  useEffect(() => {
    const fetchPdfUrl = async () => {
      if (s3KeyFromConvex === undefined) {
        // Still loading the s3Key from Convex, or it's null/undefined
        setPdfLoading(true);
        return;
      }

      if (s3KeyFromConvex === null || s3KeyFromConvex === "") {
        console.log("No S3 key available from Convex. Using initial PDF URL.");
        setCurrentPdfUrl(initialPdfUrl); // Fallback to sample PDF if no key
        setPdfLoading(false);
        return;
      }

      setPdfLoading(true); // Start loading
      try {
        console.log("Fetching presigned URL for S3 Key:", s3KeyFromConvex);
        const activeViewPresignedURL = await ViewPDFAction({
          s3Key: s3KeyFromConvex
        });

        if (activeViewPresignedURL) {
          setCurrentPdfUrl(activeViewPresignedURL);
          console.log("Successfully fetched PDF URL:", activeViewPresignedURL);
        } else {
          console.log("ViewPDF action returned no URL. Using initial PDF URL.");
          setCurrentPdfUrl(initialPdfUrl); // Fallback
        }
      } catch (error) {
        console.error("Error while getting the PDF URL:", error);
        setCurrentPdfUrl(initialPdfUrl); // Fallback on error
      } finally {
        setPdfLoading(false); // End loading
      }
    };

    fetchPdfUrl();
  }, [s3KeyFromConvex, ViewPDFAction]); // Re-run when s3KeyFromConvex or ViewPDFAction changes

  // Cleanup for object URLs
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleSignatureSave = useCallback((dataUrl: string | null) => {
    setSignatureDataUrl(dataUrl);
    if (dataUrl) {
      // IMPORTANT: Replace alert with a custom UI message (e.g., a toast)
      console.log('Signature saved! Now click on the PDF to place it, or move your mouse over the PDF to preview.');
    } else {
      console.log('Signature cleared.');
      setLiveSignaturePreview(null); // Clear preview if signature is cleared
    }
  }, []);

  const handlePdfInteraction = useCallback((params: {
    clientX?: number;
    clientY?: number;
    pageNumber: number;
    renderedPageWidth?: number;
    renderedPageHeight?: number;
    originalPdfPageWidth?: number;
    originalPdfPageHeight?: number;
    eventType: 'click' | 'mousemove';
  }) => {
    if (params.pageNumber !== currentPageNum) {
      setCurrentPageNum(params.pageNumber);
      setSignaturePlacement(null);
      setLiveSignaturePreview(null); // Clear preview on page change
      return;
    }

    if (signatureDataUrl && params.renderedPageWidth && params.originalPdfPageWidth &&
      params.renderedPageHeight && params.originalPdfPageHeight &&
      params.clientX !== undefined && params.clientY !== undefined) {
      const { clientX, clientY, renderedPageWidth, renderedPageHeight, originalPdfPageWidth, originalPdfPageHeight } = params;

      const scaleX = originalPdfPageWidth / renderedPageWidth;
      const scaleY = originalPdfPageHeight / renderedPageHeight;

      // Convert browser coordinates to PDF coordinates
      const pdfX = clientX * scaleX;

      // For Y coordinate: browser (top-left) to PDF (bottom-left)
      // We want the signature's bottom-left corner at the click point
      // So we need to subtract the signature height from the Y coordinate
      const signatureHeightInPdf = 75; // Assuming a fixed height for signature image
      const pdfY = (renderedPageHeight - clientY) * scaleY - signatureHeightInPdf;

      if (params.eventType === 'click') {
        setSignaturePlacement({ x: pdfX, y: pdfY, pageNumber: currentPageNum });
        console.log('Coordinate conversion debug:', {
          browserCoords: { x: clientX, y: clientY },
          renderedDimensions: { width: renderedPageWidth, height: renderedPageHeight },
          originalDimensions: { width: originalPdfPageWidth, height: originalPdfPageHeight },
          scales: { scaleX, scaleY },
          pdfCoords: { x: pdfX, y: pdfY },
          signatureHeight: 75,
          signatureBottomY: pdfY + 75,
          clickPointInPdf: { x: pdfX, y: pdfY + 75 }
        });
        // IMPORTANT: Replace alert with a custom UI message
        console.log(`Signature will be placed on Page ${currentPageNum} at X: ${Math.round(pdfX)}, Y: ${Math.round(pdfY)}. Click 'Apply' to confirm.`);
        setLiveSignaturePreview(null); // Clear live preview after click
      } else if (params.eventType === 'mousemove') {
        setLiveSignaturePreview({ x: pdfX, y: pdfY, pageNumber: currentPageNum });
      }
    } else if (signatureDataUrl === null) {
      if (params.eventType === 'click') {
        // IMPORTANT: Replace alert with a custom UI message
        console.log('Please draw and save your signature first using the signature pad.');
      }
    }
  }, [currentPageNum, signatureDataUrl]);

  const handleDocumentLoadSuccess = useCallback((numPages: number) => {
    setTotalPdfPages(numPages);
  }, []);

  const handlePdfMouseLeave = useCallback(() => {
    setLiveSignaturePreview(null);
  }, []);


  const handleApplySignature = async () => {
    if (!signatureDataUrl) {
      // IMPORTANT: Replace alert with a custom UI message
      console.log('Please draw and save your signature.');
      return;
    }
    if (!signaturePlacement) {
      // IMPORTANT: Replace alert with a custom UI message
      console.log('Please click on the PDF to choose where to place the signature.');
      return;
    }

    setLoading(true);
    try {
      if (!reactPdfDimensions) {
        // IMPORTANT: Replace alert with a custom UI message
        console.log('PDF dimensions not available. Please try again.');
        return;
      }

      const modifiedPdfBytes = await addSignatureToPdf(
        currentPdfUrl!, // Use currentPdfUrl, it should be set by now
        signatureDataUrl,
        signaturePlacement.x,
        signaturePlacement.y,
        signaturePlacement.pageNumber,
        150, // width for signature in PDF
        75,   // height for signature in PDF
        reactPdfDimensions
      );

      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
      const newObjectUrl = URL.createObjectURL(blob);

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setObjectUrl(newObjectUrl);

      setCurrentPdfUrl(newObjectUrl); // Update to the new signed PDF URL

      setSignaturePlacement(null);
      setSignatureDataUrl(null);
      // IMPORTANT: Replace alert with a custom UI message
      console.log('Signature applied and PDF updated successfully! Viewing the modified document.');

    } catch (error) {
      console.error('Failed to apply signature:', error);
      // IMPORTANT: Replace alert with a custom UI message
      console.log('Failed to apply signature. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Signer</h1>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-screen-xl gap-4">
        <div className="flex-1 min-w-0">
          {pdfLoading ? (
            <div className="flex items-center justify-center h-96 text-gray-600">
              Loading PDF...
            </div>
          ) : currentPdfUrl ? (
            <PDF
              pdfUrl={currentPdfUrl}
              onPageClick={handlePdfInteraction}
              onPageMouseMove={handlePdfInteraction}
              onPageMouseLeave={handlePdfMouseLeave}
              currentPageNumber={currentPageNum}
              onDocumentLoadSuccess={handleDocumentLoadSuccess}
              signatureDataUrl={signatureDataUrl}
              liveSignaturePreview={liveSignaturePreview}
              onPageDimensionsChange={setReactPdfDimensions}
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-red-600">
              Failed to load PDF.
            </div>
          )}
        </div>

        <div className="flex-none w-full md:w-80 p-4 bg-gray-100 rounded-lg shadow-md">
          <SignPreview onSignatureSave={handleSignatureSave} />

          <div className="mt-6 text-center">
            {signaturePlacement && (
              <p className="mb-4 text-blue-600 font-medium text-sm">
                Signature selected for Page {signaturePlacement.pageNumber} at X: {Math.round(signaturePlacement.x)}, Y: {Math.round(signaturePlacement.y)}.
              </p>
            )}
            <button
              onClick={handleApplySignature}
              disabled={loading || !signatureDataUrl || !signaturePlacement || pdfLoading}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 w-full"
            >
              {loading ? 'Processing...' : 'Apply Signature & Update PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
