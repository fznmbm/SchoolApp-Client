import React, { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStudent } from "@services/student";
import { Button } from "@components/common/Button";
import { motion } from "framer-motion";
import { 
  ArrowLeftIcon, 
  HeartIcon, 
  DocumentIcon, 
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon, 
  EyeIcon 
} from "@heroicons/react/24/outline";
import { useDocumentViewer } from "@components/common/DocumentViewer";
import { HistoryTracker } from "@components/common/HistoryTracker";

const StudentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openDocument, DocumentViewer } = useDocumentViewer();

  const {
    data: student,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
    enabled: !!id,
  });

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleEdit = useCallback(() => {
    navigate(`/students/${id}/edit`);
  }, [navigate, id]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get document type info
  const getDocumentTypeInfo = (document) => {
    const mimeType = document.fileMimeType || '';
  
    // Default values
    let icon = DocumentIcon;
    let displayType = 'Document';
    let color = 'text-gray-500 dark:text-gray-400';
    let isImage = false;
  
    // Check by MIME type
    if (mimeType.includes('pdf')) {
      icon = DocumentTextIcon;
      displayType = 'PDF';
      color = 'text-red-500 dark:text-red-400';
    } else if (mimeType.includes('image')) {
      icon = DocumentIcon;
      displayType = 'Image';
      color = 'text-blue-500 dark:text-blue-400';
      isImage = true;
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      icon = DocumentIcon;
      displayType = 'Spreadsheet';
      color = 'text-green-500 dark:text-green-400';
    } else if (mimeType.includes('word')) {
      icon = DocumentIcon;
      displayType = 'Document';
      color = 'text-blue-700 dark:text-blue-400';
    }
  
    return { icon, displayType, color, isImage };
  };

  // Handle document viewing
  const handleViewDocument = (document) => {
    const typeInfo = getDocumentTypeInfo(document);
    
    // Get the Google Drive file ID from the URL
    let viewUrl = document.fileUrl;
    
    // Check if it's a Google Drive URL and convert to proper embed format
    if (document.fileUrl && document.fileUrl.includes('drive.google.com')) {
      // Try to extract file ID from Google Drive URL
      const fileIdMatch = document.fileUrl.match(/[-\w]{25,}/);
      if (fileIdMatch && fileIdMatch[0]) {
        const fileId = fileIdMatch[0];
        // Create a proper embed URL
        viewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    
    openDocument(viewUrl, {
      title: document.fileName || 'Student Document',
      downloadUrl: document.downloadUrl,
      type: typeInfo.displayType.toLowerCase(),
      fileName: document.fileName,
      isImage: typeInfo.isImage,
      document: document
    });
  };

  // Loading state with dark mode support
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen transition-colors duration-200">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
          <p className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

  // Error state with dark mode support
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen transition-colors duration-200">
        <div className="bg-surface dark:bg-surface-dark shadow-md rounded-lg p-8 max-w-md w-full text-center border border-border-light dark:border-border-dark-mode transition-colors duration-200">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4 transition-colors duration-200" />
          <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary mb-2 transition-colors duration-200">
            Error Loading Details
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 transition-colors duration-200">
            {error?.message || 'Unable to fetch student information'}
          </p>
          <Button 
            onClick={handleBack} 
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transition-colors duration-200"
            aria-label="Go back to previous page"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const hasDocument = student?.document && Object.keys(student.document).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      {/* Document Viewer Component */}
      <DocumentViewer />

      {/* Header with navigation buttons */}
      <div className="mb-6 flex justify-between items-center">
        <Button 
          onClick={handleBack} 
          aria-label="Go back to students list"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Students
        </Button>
        <Button
          onClick={handleEdit}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors duration-200"
          aria-label="Edit student information"
        >
          Edit Student
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <div className="bg-surface dark:bg-surface-dark shadow overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark-mode transition-colors duration-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
              Student Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
              Personal and academic information
            </p>
          </div>
          <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">Full Name</dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  {student?.firstName} {student?.lastName}
                </dd>
              </div>
              <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">Grade</dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  {student?.grade}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
                <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">School</dt>
                <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                  {student?.school?.name || "Not Assigned"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Student Document Section */}
        {hasDocument && (
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark-mode transition-colors duration-200">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                Student Document
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                Supporting documentation for student
              </p>
            </div>
            <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
              <div className="px-4 py-5 sm:p-6">
                {(() => {
                  const document = student.document;
                  const typeInfo = getDocumentTypeInfo(document);
                  const Icon = typeInfo.icon;
                  return (
                    <div 
                      className="flex flex-col border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow max-w-md"
                      aria-label={`${typeInfo.displayType} document: ${document.fileName || 'Document'}`}
                    >
                      <div className="px-4 py-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-5 w-5 ${typeInfo.color}`} />
                          <span className="text-sm font-medium truncate max-w-[150px] text-gray-700 dark:text-gray-300">{typeInfo.displayType}</span>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => window.open(document.downloadUrl, '_blank')}
                            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                            title="Download document"
                            aria-label={`Download ${document.fileName || 'document'}`}
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleViewDocument(document)}
                            className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                            title="View document"
                            aria-label={`View ${document.fileName || 'document'}`}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 flex-grow bg-white dark:bg-gray-800">
                        <p className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">{document.fileName || 'Document'}</p>
                        {document.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{document.description}</p>
                        )}
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <p>Uploaded: {formatDate(document.uploadedAt || document.createdAt || new Date())}</p>
                          {/* {document.status && (
                            <p className="mt-1 flex items-center">
                              Status: <span className={`ml-1 ${document.status === 'APPROVED' ? 'text-green-500 dark:text-green-400' : document.status === 'REJECTED' ? 'text-red-500 dark:text-red-400' : 'text-yellow-500 dark:text-yellow-400'}`}>
                                {document.status}
                              </span>
                            </p>
                          )} */}
                        </div>
                        <button
                          onClick={() => handleViewDocument(document)}
                          className="mt-3 w-full text-sm px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 flex items-center justify-center transition-colors duration-200"
                          aria-label={`View document: ${document.fileName || 'Document'}`}
                        >
                          <EyeIcon className="h-4 w-4 mr-1.5" />
                          View Document
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Parents/Guardians Information */}
        <div className="bg-surface dark:bg-surface-dark shadow overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark-mode transition-colors duration-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
              Parents/Guardians
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
              Contact information for parents or guardians
            </p>
          </div>
          <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
            <dl>
              {student?.parents?.map((parent, index) => (
                <div 
                  key={index} 
                  className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200 ${
                    index % 2 === 0 
                      ? 'bg-gray-50 dark:bg-gray-800/50' 
                      : 'bg-surface dark:bg-surface-dark'
                  }`}
                >
                  <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    {index === 0 ? 'Primary' : 'Secondary'} Parent/Guardian
                  </dt>
                  <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                    <p className="font-medium">{parent.name}</p>
                    <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                      Relationship: {parent?.relationship}
                    </p>
                    
                    <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                      WhatsApp: {parent?.whatsapp
                        ? parent?.whatsapp?.replace(/\s+/g, "").replace(/-/g, "")
                        : "N/A"}
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                      Address: {parent?.address?.street}, {parent?.address?.city}, 
                      {parent?.address?.county}, {parent?.address?.postCode}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Special Care Needs */}
        {student?.specialCareNeeds && student.specialCareNeeds.length > 0 && (
          <div className="bg-surface dark:bg-surface-dark shadow overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark-mode transition-colors duration-200">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <HeartIcon className="h-6 w-6 mr-3 text-yellow-500 dark:text-yellow-400 transition-colors duration-200" />
              <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                Special Care Needs
              </h3>
            </div>
            <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
              {student.specialCareNeeds.map((need, index) => (
                <div 
                  key={index} 
                  className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200 ${
                    index % 2 === 0 
                      ? 'bg-gray-50 dark:bg-gray-800/50' 
                      : 'bg-surface dark:bg-surface-dark'
                  }`}
                >
                  <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    Special Need {index + 1}
                  </dt>
                  <dd className="mt-1 text-sm text-text-primary dark:text-text-dark-primary sm:mt-0 sm:col-span-2 transition-colors duration-200">
                    <p className="font-medium">{need.type}</p>
                    <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-2 transition-colors duration-200">
                      {need.description}
                    </p>
                    {need.fileUrl && (
                      <div className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200">
                        <DocumentIcon className="h-5 w-5 mr-2" />
                        <a 
                          href={need.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="underline"
                          aria-label={`View supporting document for ${need.type}`}
                        >
                          View Supporting Document
                        </a>
                      </div>
                    )}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History Section */}
        {student?.history && student.history.length > 0 && (
          <div className="mt-6">
            <HistoryTracker
              history={student.history}
              title="Student History"
              subtitle="Record of student information changes"
              entityType="student"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentView;