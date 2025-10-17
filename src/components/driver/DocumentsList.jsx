import React, { useState, useCallback } from 'react';
import { 
  DocumentIcon, 
  DocumentTextIcon, 
  PhotoIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useDocumentViewer } from '@components/common/DocumentViewer';
import { usePopup } from '@components/common/modal/Popup';

import DocumentUpdateModal from './DocumentUpdateModal';

const DocumentsList = ({ 
  title, 
  documents, 
  driverId, 
  onUpdateDocument,
  onDeleteDocument,
  isVehicleDocuments = false 
}) => {
  const { openDocument, DocumentViewer, isOpen, closeDocument } = useDocumentViewer();
  const { openPopup, Popup } = usePopup();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Define all possible document types
  const allDocumentTypes = isVehicleDocuments 
    ? [
        { type: 'LICENSE', name: 'Vehicle License' },
        { type: 'INSURANCE', name: 'Insurance' },
        { type: 'INSPECTION', name: 'Vehicle Inspection' },
        { type: 'MOT', name: 'MOT Certificate' }
      ]
    : [
        { type: 'DBS', name: 'DBS Certificate' },
        { type: 'LICENSE', name: 'Driver License' },
        { type: 'TAXI_LICENSE', name: 'Taxi License' },
        { type: 'MEDICAL_CERTIFICATE', name: 'Medical Certificate' }
      ];

  const handleUpdateClick = useCallback((docType) => {
    const existingDoc = documents?.find(doc => doc.type === docType);
    setSelectedDocument(existingDoc || { type: docType });
    setShowUpdateModal(true);
  }, [documents]);

  const handleUpdateDocument = useCallback(async (values) => {
    if (!driverId) return;
    await onUpdateDocument(driverId, selectedDocument?.type || '', values, isVehicleDocuments);
  }, [driverId, selectedDocument, onUpdateDocument, isVehicleDocuments]);

  const handleDeleteDocument = useCallback((docType, docName) => {
    openPopup(
      'Delete Document',
      `Are you sure you want to delete this ${docName}? This action cannot be undone.`,
      async () => {
        if (!driverId) return;
        await onDeleteDocument(driverId, docType, isVehicleDocuments);
      }
    );
  }, [driverId, onDeleteDocument, isVehicleDocuments, openPopup]);

  // Initialize empty documents array if none provided
  const documentsList = documents || [];

  const handleViewDocument = (doc) => {
    if (!doc.file || !doc.file.fileUrl) {
      console.error('No file URL available for document:', doc);
      return;
    }

    const fileInfo = getDocumentTypeInfo(doc.file);
    
    // For Google Drive files, we need to handle them specially
    const isGoogleDrive = doc.file.fileUrl.includes('drive.google.com');
    
    // Different URL handling based on file type
    let viewUrl;
    
    if (isGoogleDrive) {
      // Extract the file ID from Google Drive URL
      const fileIdMatch = doc.file.fileUrl.match(/[-\w]{25,}/);
      const fileId = fileIdMatch ? fileIdMatch[0] : null;
      
      if (fileId) {
        // For Google Drive documents, use the preview URL which has better permissions handling
        viewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      } else {
        // Fallback to the original URL if we can't extract the file ID
        viewUrl = doc.file.fileUrl;
      }
    } else {
      // For non-Google Drive documents, use the original URL
      viewUrl = doc.file.fileUrl;
    }
    
    openDocument(viewUrl, {
      title: `${doc.type || 'Document'} - ${doc.file.fileName || ''}`,
      downloadUrl: doc.file.downloadUrl,
      type: fileInfo.type.toLowerCase(),
      fileName: doc.file.fileName,
      isImage: fileInfo.isImage && !isGoogleDrive, // Don't treat Google Drive docs as images
      isGoogleDrive: isGoogleDrive,
      document: doc,
      originalUrl: doc.file.fileUrl
    });
  };

  const getDocumentTypeInfo = (file) => {
    if (!file) return { icon: DocumentIcon, type: 'Document', color: 'text-gray-500', isImage: false };
    
    const mimeType = file.fileMimeType || '';
    const fileName = file.fileName || '';
    const fileExtension = fileName.split('.').pop().toLowerCase();
    
    let icon = DocumentIcon;
    let type = 'Document';
    let color = 'text-gray-500 dark:text-gray-400';
    let isImage = false;
    
    if (mimeType.includes('pdf') || fileExtension === 'pdf') {
      icon = DocumentTextIcon;
      type = 'PDF';
      color = 'text-red-500 dark:text-red-400';
    } else if (
      mimeType.includes('image') || 
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(fileExtension)
    ) {
      icon = PhotoIcon;
      type = 'Image';
      color = 'text-blue-500 dark:text-blue-400';
      isImage = true;
    } else if (
      mimeType.includes('excel') || 
      mimeType.includes('spreadsheet') ||
      ['xls', 'xlsx', 'csv'].includes(fileExtension)
    ) {
      icon = DocumentIcon;
      type = 'Spreadsheet';
      color = 'text-green-500 dark:text-green-400';
    } else if (
      mimeType.includes('word') || 
      ['doc', 'docx'].includes(fileExtension)
    ) {
      icon = DocumentIcon;
      type = 'Document';
      color = 'text-blue-700 dark:text-blue-400';
    }
    
    return { icon, type, color, isImage };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const StatusBadge = ({ status }) => {
    if (!status) return null;
    
    const getStatusInfo = () => {
      switch (status.toUpperCase()) {
        case 'APPROVED':
          return {
            icon: CheckCircleIcon,
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-800 dark:text-green-400',
            label: 'Approved'
          };
        case 'REJECTED':
          return {
            icon: ExclamationCircleIcon,
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-800 dark:text-red-400',
            label: 'Rejected'
          };
        case 'PENDING':
        default:
          return {
            icon: DocumentIcon,
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            text: 'text-yellow-800 dark:text-yellow-400',
            label: 'Pending'
          };
      }
    };
    
    const { icon: Icon, bg, text, label } = getStatusInfo();
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} transition-colors duration-200`}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </span>
    );
  };

  return (
    <div className="bg-surface dark:bg-surface-dark shadow overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark-mode transition-colors duration-200">
      <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
        <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          {title}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          {documentsList.length} {documentsList.length === 1 ? 'document' : 'documents'}
        </span>
      </div>
      
      <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
          {allDocumentTypes.map((docType) => {
            const doc = documentsList.find(d => d.type === docType.type);
            const fileInfo = doc?.file ? getDocumentTypeInfo(doc.file) : { icon: DocumentIcon, type: 'Unknown', color: 'text-gray-500' };
            const Icon = fileInfo.icon;
            
            return (
              <li key={docType.type} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                <div className="flex items-start justify-between flex-wrap md:flex-nowrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-5 h-5 ${fileInfo.color} transition-colors duration-200`} />
                      <h4 className="text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200 truncate">
                        {docType.name}
                        {doc?.number && <span className="ml-1.5 text-gray-500 dark:text-gray-400">#{doc.number}</span>}
                      </h4>
                      {doc?.file && doc.file.status && (
                        <StatusBadge status={doc.file.status} />
                      )}
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 grid grid-cols-1 md:grid-cols-2 gap-1 transition-colors duration-200">
                      {doc?.issuedDate && (
                        <p>Issued: {formatDate(doc.issuedDate)}</p>
                      )}
                      {doc?.expiryDate && (
                        <p className={`${
                          new Date(doc.expiryDate) < new Date() 
                            ? 'text-red-600 dark:text-red-400 font-medium' 
                            : ''
                        }`}>
                          Expires: {formatDate(doc.expiryDate)}
                        </p>
                      )}
                      {doc?.file && doc.file.fileName && (
                        <p className="truncate md:col-span-2">
                          File: {doc.file.fileName}
                        </p>
                      )}
                      {!doc?.file && (
                        <p className="text-gray-400 dark:text-gray-500 italic">
                          No document uploaded
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0 flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-2 mt-2 md:mt-0">
                    {doc?.file && doc.file.downloadUrl && (
                      <a
                        href={doc.file.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                        aria-label={`Download ${docType.name}`}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" />
                        Download
                      </a>
                    )}
                    
                    {doc?.file && doc.file.fileUrl && (
                      <button
                        onClick={() => handleViewDocument(doc)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors duration-200"
                        aria-label={`View ${docType.name}`}
                      >
                        <EyeIcon className="w-4 h-4 mr-1.5" />
                        View
                      </button>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpdateClick(docType.type)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/30 transition-colors duration-200"
                        aria-label={`${doc?.file ? 'Update' : 'Add'} ${docType.name}`}
                      >
                        <PencilIcon className="w-4 h-4 mr-1.5" />
                        {doc?.file ? 'Update' : 'Add'}
                      </button>
                      {doc?.file && (
                        <button
                          onClick={() => handleDeleteDocument(docType.type, docType.name)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors duration-200"
                          aria-label={`Delete ${docType.name}`}
                        >
                          <TrashIcon className="w-4 h-4 mr-1.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>


      
      <DocumentViewer 
        isOpen={isOpen} 
        onClose={closeDocument}
      />

      <Popup />

      <DocumentUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        documentType={selectedDocument?.type}
        documentData={selectedDocument}
        onSubmit={handleUpdateDocument}
        isVehicleDocument={isVehicleDocuments}
      />
      
    </div>
  );
};

export default DocumentsList;