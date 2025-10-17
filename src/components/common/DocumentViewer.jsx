import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import {
  XMarkIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

const DocumentViewer = ({ isOpen, onClose, documentData }) => {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const imgRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setImageLoaded(false);
      setErrorMsg('');
      
      if (documentData?.isImage) {
        const img = new Image();
        if (documentData?.url) {
          img.src = documentData.url;
        }
      }
    }
  }, [isOpen, documentData?.url, documentData?.isImage]);
  
  const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev + 10, 200)), []);
  const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev - 10, 50)), []);
  
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);
  
  const handleDownload = useCallback(() => {
    if (!documentData?.downloadUrl) return;
    
    const a = document.createElement('a');
    a.href = documentData.downloadUrl;
    a.download = documentData?.fileName || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [documentData?.downloadUrl, documentData?.fileName]);
  
  const getDocumentIcon = useCallback(() => {
    const type = documentData?.type || 'other';
    
    switch (type) {
      case 'pdf':
        return <DocumentTextIcon className="w-5 h-5 text-red-500 dark:text-red-400" />;
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <PhotoIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
      case 'excel':
        return <DocumentChartBarIcon className="w-5 h-5 text-green-500 dark:text-green-400" />;
      default:
        return <DocumentIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
  }, [documentData?.type]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);
  
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setImageLoaded(true);
  }, []);
  
  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setImageLoaded(true);
    setErrorMsg('Failed to load image. The image format may be unsupported or the URL is incorrect.');
    
    if (imgRef.current) {
      imgRef.current.crossOrigin = "anonymous";
      const cacheBuster = `?t=${new Date().getTime()}`;
      const newSrc = documentData?.url.includes('?') 
        ? `${documentData?.url}&_cb=${cacheBuster}`
        : `${documentData?.url}${cacheBuster}`;
      imgRef.current.src = newSrc;
    }
  }, [documentData?.url]);
  
  // Exit fullscreen when closing the viewer
  const handleClose = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
  }, [onClose]);
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-hidden" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>
        
        <div className="fixed inset-0 flex flex-col">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-4"
          >
            <Dialog.Panel className="flex flex-col h-full w-full">
              {/* Toolbar */}
              <div className="relative flex items-center justify-between px-4 h-16 bg-surface dark:bg-surface-dark shadow-sm dark:shadow-gray-900 z-10 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleClose}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                    aria-label="Close"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {getDocumentIcon()}
                    <Dialog.Title className="text-base font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                      {documentData?.title || 'Document'}
                    </Dialog.Title>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Zoom Controls */}
                  <div className="flex items-center space-x-1 px-2 bg-surface dark:bg-surface-dark border border-border-light dark:border-border-dark-mode rounded-lg shadow-sm dark:shadow-gray-900 transition-colors duration-200">
                    <button 
                      onClick={handleZoomOut}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200"
                      aria-label="Zoom out"
                    >
                      -
                    </button>
                    <span className="text-sm w-12 text-center text-text-primary dark:text-text-dark-primary transition-colors duration-200">{zoom}%</span>
                    <button 
                      onClick={handleZoomIn}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors duration-200"
                      aria-label="Zoom in"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={handleDownload}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                      aria-label="Download"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={toggleFullscreen}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                      aria-label="Toggle fullscreen"
                    >
                      {isFullscreen ? (
                        <ArrowsPointingInIcon className="w-5 h-5" />
                      ) : (
                        <ArrowsPointingOutIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Document Content */}
              <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-auto transition-colors duration-200">
                {/* Loading indicator */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 z-10 transition-colors duration-200">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin transition-colors duration-200"></div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">Loading document...</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-center min-h-full py-6">
                  <div 
                    className="bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900 rounded overflow-hidden transition-colors duration-300"
                    style={{
                      width: `${zoom}%`,
                      maxWidth: '1200px',
                      height: `calc(100vh - 130px)`,
                    }}
                  >
                    {(documentData?.isImage && !documentData?.isGoogleDrive) ? (
                      // For regular images
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 dark:bg-gray-900 transition-colors duration-200">
                        {/* Show loading state while loading */}
                        {isLoading && !imageLoaded && (
                          <div className="text-center text-white">
                            <p>Loading image...</p>
                          </div>
                        )}
                        <div className="flex flex-col items-center justify-center">
                          <img 
                            ref={imgRef}
                            key={documentData.url}
                            src={documentData.url} 
                            alt={documentData.title || "Document"} 
                            className="max-w-full max-h-full object-contain"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            style={{ display: imageLoaded ? 'block' : 'none' }}
                          />
                          {imageLoaded && !errorMsg && (
                            <div className="text-sm mt-2 text-white">
                              {documentData.fileName || "Image"}
                            </div>
                          )}
                          {imageLoaded && errorMsg && (
                            <div className="text-red-500 mt-4 p-4 bg-gray-800 rounded-md">
                              <p className="font-semibold">Error loading image</p>
                              <p className="text-sm mt-1">{errorMsg}</p>
                              <button 
                                className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded"
                                onClick={handleDownload}
                              >
                                Download Instead
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : documentData?.isGoogleDrive ? (
                      // Special handling for Google Drive content
                      <div className="w-full h-full">
                        <iframe
                          src={documentData.originalUrl}
                          className="w-full h-full border-0"
                          title={documentData.title || "Google Drive Document"}
                          onLoad={handleIframeLoad}
                        />
                      </div>
                    ) : (
                      // For PDFs and other documents
                      <iframe
                        id="document-preview-iframe"
                        src={documentData?.url}
                        className="w-full h-full border-0"
                        title="Document Preview"
                        sandbox="allow-scripts allow-same-origin allow-popups"
                        onLoad={handleIframeLoad}
                      />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Page Navigation (for multi-page documents) */}
              {/* {documentData?.type === 'pdf' && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-4 bg-surface dark:bg-surface-dark rounded-full shadow-lg dark:shadow-gray-900 px-4 py-2 border border-border-light dark:border-border-dark-mode transition-colors duration-200">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                      aria-label="Previous page"
                      disabled={currentPage <= 1}
                    >
                      <ChevronLeftIcon className={`w-5 h-5 ${currentPage <= 1 ? 'opacity-50' : ''}`} />
                    </button>
                    <span className="text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">Page {currentPage}</span>
                    <button 
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="p-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
                      aria-label="Next page"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )} */}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

// Updated hook for managing the document viewer state
export const useDocumentViewer = () => {
  const [viewerState, setViewerState] = useState({
    isOpen: false,
    documentData: null
  });

  const openDocument = useCallback((url, options = {}) => {
    if (!url) return;
    
    // Special handling for Google Drive URLs
    let finalUrl = url;
    const isGoogleDrive = url.includes('drive.google.com/file/d/');
    let fileId = null;
    
    if (isGoogleDrive) {
      // Extract file ID from Google Drive URL
      const matches = url.match(/\/file\/d\/([^\/]+)/);
      if (matches && matches[1]) {
        fileId = matches[1];
        // Convert to a direct download URL format that works with img tags
        finalUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
    
    // Extract file extension with better handling
    const urlPath = url.split('?')[0];
    let fileExtension = urlPath.split('.').pop()?.toLowerCase();
    
    // If it's a Google Drive URL without extension, try to guess from the type or default to 'png'
    if (isGoogleDrive && (!fileExtension || fileExtension.includes('/'))) {
      fileExtension = options.type || 'png';
    }
    
    const isPng = fileExtension === 'png' || options.type === 'png';
    const isImage = options.isImage || 
                    /\.(jpeg|jpg|gif|png|webp|svg|bmp)$/i.test(urlPath) ||
                    options.type?.match(/(image|png|jpg|jpeg|gif)/i) !== null ||
                    isGoogleDrive;
    
    const documentData = {
      url: finalUrl,
      originalUrl: url,
      title: options.title || (isImage ? (isPng ? 'PNG Image' : 'Image') : 'Document'),
      downloadUrl: options.downloadUrl || url,
      type: options.type || (isPng ? 'png' : (isImage ? 'image' : 'other')),
      fileName: options.fileName || urlPath.split('/').pop() || 'document',
      isImage: isImage,
      isPng: isPng,
      isGoogleDrive: isGoogleDrive,
      fileId: fileId,
      ...options.document
    };
    
    setViewerState({
      isOpen: true,
      documentData
    });
  }, []);

  const closeDocument = useCallback(() => {
    setViewerState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  // Custom component for using in JSX
  const DocumentViewerComponent = (props) => (
    <DocumentViewer 
      isOpen={viewerState.isOpen} 
      onClose={closeDocument}
      documentData={viewerState.documentData}
      {...props}
    />
  );

  return {
    isOpen: viewerState.isOpen,
    documentData: viewerState.documentData,
    openDocument,
    closeDocument,
    DocumentViewer: DocumentViewerComponent
  };
};

export default DocumentViewer;