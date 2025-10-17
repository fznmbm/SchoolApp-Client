import React from 'react';
import { 
  AcademicCapIcon,
  DocumentTextIcon, 
  ArrowDownTrayIcon,
  EyeIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CalendarIcon,
  IdentificationIcon
} from "@heroicons/react/24/outline";
import { useDocumentViewer } from '@components/common/DocumentViewer';

const TrainingList = ({ trainings }) => {
  const { openDocument, DocumentViewer, isOpen, closeDocument } = useDocumentViewer();

  if (!trainings || trainings.length === 0) {
    return (
      <div className="bg-surface dark:bg-surface-dark shadow overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark-mode transition-colors duration-200">
        <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Training Certificates
          </h3>
        </div>
        <div className="border-t border-border-light dark:border-border-dark-mode px-4 py-6 text-center text-gray-500 dark:text-gray-400 transition-colors duration-200">
          No training certificates available
        </div>
      </div>
    );
  }

  // Handle document viewing with proper detection of Google Drive links
  const handleViewDocument = (training) => {
    if (!training.file || !training.file.fileUrl) {
      console.error('No file URL available for training:', training);
      return;
    }

    // For Google Drive files, we need to handle them specially
    const isGoogleDrive = training.file.fileUrl.includes('drive.google.com');
    
    // Different URL handling based on file type
    let viewUrl;
    
    if (isGoogleDrive) {
      // Extract the file ID from Google Drive URL
      const fileIdMatch = training.file.fileUrl.match(/[-\w]{25,}/);
      const fileId = fileIdMatch ? fileIdMatch[0] : null;
      
      if (fileId) {
        // For Google Drive documents, use the preview URL which has better permissions handling
        viewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      } else {
        // Fallback to the original URL if we can't extract the file ID
        viewUrl = training.file.fileUrl;
      }
    } else {
      // For non-Google Drive documents, use the original URL
      viewUrl = training.file.fileUrl;
    }
    
    openDocument(viewUrl, {
      title: `${training.training?.trainingName || 'Training'} Certificate`,
      downloadUrl: training.file.downloadUrl,
      type: 'pdf', // Most training certificates are PDFs
      fileName: training.file.fileName,
      isImage: false, // Treat training certificates as documents, not images
      isGoogleDrive: isGoogleDrive,
      document: training,
      // Original URL for potential fallback
      originalUrl: training.file.fileUrl
    });
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
            icon: DocumentTextIcon,
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
        <div className="flex items-center">
          <AcademicCapIcon className="w-5 h-5 mr-2 text-blue-500 dark:text-blue-400" />
          <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Training Certificates
          </h3>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          {trainings.length} {trainings.length === 1 ? 'certificate' : 'certificates'}
        </span>
      </div>
      
      <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
          {trainings.map((training) => (
            <li key={training._id} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
              <div className="flex items-start justify-between flex-wrap md:flex-nowrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <AcademicCapIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 transition-colors duration-200" />
                    <h4 className="text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200 truncate">
                      {training.training?.trainingName || 'Training'}
                    </h4>
                    {training.file && training.file.status && (
                      <StatusBadge status={training.file.status} />
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 grid grid-cols-1 md:grid-cols-2 gap-1 transition-colors duration-200">
                    {training.certificateNumber && (
                      <div className="flex items-center">
                        <IdentificationIcon className="w-3.5 h-3.5 mr-1" />
                        <span>Certificate #: {training.certificateNumber}</span>
                      </div>
                    )}
                    {training.completionDate && (
                      <div className="flex items-center">
                        <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                        <span>Completed: {formatDate(training.completionDate)}</span>
                      </div>
                    )}
                    {training.expiryDate && (
                      <div className={`flex items-center ${
                        new Date(training.expiryDate) < new Date() 
                          ? 'text-red-600 dark:text-red-400 font-medium' 
                          : ''
                      }`}>
                        <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                        <span>Expires: {formatDate(training.expiryDate)}</span>
                      </div>
                    )}
                    {training.file && training.file.fileName && (
                      <p className="truncate md:col-span-2">
                        File: {training.file.fileName}
                      </p>
                    )}
                  </div>
                </div>
                
                {training.file && (
                  <div className="ml-4 flex-shrink-0 flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-2 mt-2 md:mt-0">
                    {training.file.downloadUrl && (
                      <a
                        href={training.file.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                        aria-label={`Download ${training.training?.trainingName || 'Training'} certificate`}
                      >
                        <ArrowDownTrayIcon className="w-4 h-4 mr-1.5" />
                        Download
                      </a>
                    )}
                    
                    {training.file.fileUrl && (
                      <button
                        onClick={() => handleViewDocument(training)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors duration-200"
                        aria-label={`View ${training.training?.trainingName || 'Training'} certificate`}
                      >
                        <EyeIcon className="w-4 h-4 mr-1.5" />
                        View
                      </button>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Document Viewer Component */}
      <DocumentViewer 
        isOpen={isOpen} 
        onClose={closeDocument}
      />
    </div>
  );
};

export default TrainingList;