import React, { useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPA } from "@/services/pa";
import { getAllTrainingsForMapping } from "@/services/training";
import { Button } from "@/components/common/Button";
import { motion } from "framer-motion";
import {
  ArrowLeftIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ClockIcon as ClockIconSolid,
  EyeIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { useDocumentViewer } from "@/components/common/DocumentViewer";
import { HistoryTracker } from "@/components/common/HistoryTracker";


const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  // Format day with ordinal suffix (1st, 2nd, 3rd, etc.)
  const day = date.getDate();
  const suffix = getDaySuffix(day);

  // Format month as abbreviated name (Jan, Feb, Mar, etc.)
  const month = date.toLocaleString('en-US', { month: 'short' });

  // Get year
  const year = date.getFullYear();

  return `${day}${suffix} ${month} ${year}`;
};

// Helper function to get the ordinal suffix for a day number
const getDaySuffix = (day) => {
  if (day >= 11 && day <= 13) {
    return 'th';
  }

  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const DocumentStatus = ({ status }) => {
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "VALID":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "EXPIRED":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      case "EXPIRING_SOON":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "PENDING_VERIFICATION":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case "VALID":
        return <CheckCircleIcon className="w-4 h-4 mr-1" />;
      case "EXPIRED":
        return <ExclamationCircleIcon className="w-4 h-4 mr-1" />;
      case "EXPIRING_SOON":
        return <ClockIconSolid className="w-4 h-4 mr-1" />;
      case "PENDING_VERIFICATION":
        return <MagnifyingGlassIcon className="w-4 h-4 mr-1" />;
      default:
        return null;
    }
  }, []);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${getStatusColor(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status.replace("_", " ")}
    </span>
  );
};

const getDocumentStatus = (expiryDate) => {
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  if (new Date(expiryDate) < now) {
    return "EXPIRED";
  } else if (new Date(expiryDate) <= thirtyDaysFromNow) {
    return "EXPIRING_SOON";
  }
  return "VALID";
};

const getDocumentTypeInfo = (document) => {
  // Get file info from either file object or directly from document
  const file = document.file || document;
  const mimeType = file.fileMimeType || '';

  // Default values
  let icon = DocumentIcon;
  let displayType = 'Document';
  let color = 'text-gray-500 dark:text-gray-400';
  let isImage = false;

  // Check by MIME type
  if (mimeType.includes('pdf')) {
    icon = DocumentIcon;
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

const PersonalDetails = ({ pa }) => (
  <div className="bg-surface dark:bg-surface-dark shadow overflow-hidden sm:rounded-lg border border-border-light dark:border-border-dark transition-colors duration-200">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        Personal Assistant Details
      </h3>
      <p className="mt-1 max-w-2xl text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Personal and professional information
      </p>
    </div>
    <div className="border-t border-border-light dark:border-border-dark transition-colors duration-200">
      <dl>
        <DetailRow
          label="PA Number"
          value={pa?.paNumber}
          isAlternate
        />

        <DetailRow
          label="Name"
          value={pa?.name}
          icon={UserIcon}
        />

        <DetailRow
          label="Short Name"
          value={pa?.shortName || 'N/A'}
          icon={UserIcon}
          isAlternate
        />

        <DetailRow
          label="Contact Information"
          isAlternate
          customContent={
            <div className="space-y-1">
              <div className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                  {pa?.contact?.phone || 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                <MagnifyingGlassIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                  {pa?.contact?.email || 'N/A'}
                </span>
              </div>
            </div>
          }
        />

        <DetailRow
          label="Status"
          customContent={
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${pa?.status === "ACTIVE"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                }`}
            >
              {pa?.status}
            </span>
          }
        />

        <DetailRow
          label="Personal Details"
          isAlternate
          customContent={
            <div className="space-y-1">
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />
                <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                  Address: {pa?.address
                    ? `${pa.address.street}, ${pa.address.city}, ${pa.address.county || pa.address.state || ''}${pa.address.postCode ? ` ${pa.address.postCode}` : ''}`
                    : 'N/A'}
                </span>
              </div>
            </div>
          }
        />
      </dl>
    </div>
  </div>
);

const DetailRow = ({ label, value, icon, isAlternate = false, customContent }) => {
  const Icon = icon;

  return (
    <div className={`${isAlternate
      ? 'bg-gray-50 dark:bg-gray-800/50'
      : 'bg-surface dark:bg-surface-dark'
      } px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200`}
    >
      <dt className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        {label}
      </dt>
      <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
        {customContent || (
          <div className="flex items-center">
            {Icon && <Icon className="w-5 h-5 mr-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200" />}
            <span className="text-text-primary dark:text-text-dark-primary transition-colors duration-200">{value}</span>
          </div>
        )}
      </dd>
    </div>
  );
};

const DocumentsList = ({ title, documents, handleViewDocument }) => (
  <div className="bg-surface dark:bg-surface-dark shadow overflow-hidden sm:rounded-lg mt-6 border border-border-light dark:border-border-dark transition-colors duration-200">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        {title}
      </h3>
      <p className="mt-1 max-w-2xl text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Document details and verification status
      </p>
    </div>
    <div className="border-t border-border-light dark:border-border-dark transition-colors duration-200">
      {documents && documents.length > 0 ? (
        <ul className="divide-y divide-border-light dark:divide-border-dark transition-colors duration-200">
          {documents.map((doc, index) => {
            const fileData = doc.file || {};
            const typeInfo = getDocumentTypeInfo(doc);
            const Icon = typeInfo.icon;

            return (
              <li key={index} className="px-4 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Icon className={`w-5 h-5 mr-2 ${typeInfo.color} transition-colors duration-200`} />
                      <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                        {doc.type || typeInfo.displayType}
                      </p>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                        Number: {doc.number || 'N/A'}
                      </p>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                        Issued: {doc.issuedDate ? formatDate(doc.issuedDate) : 'N/A'}
                      </p>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                        Expires: {doc.expiryDate ? formatDate(doc.expiryDate) : 'N/A'}
                      </p>
                      {fileData.fileName && (
                        <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                          File: {fileData.fileName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <DocumentStatus
                      status={doc.status || (doc.expiryDate ? getDocumentStatus(doc.expiryDate) : "PENDING_VERIFICATION")}
                    />

                    {fileData.fileUrl && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(fileData.downloadUrl, '_blank')}
                          className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                          title="Download document"
                          aria-label={`Download ${fileData.fileName || 'document'}`}
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleViewDocument(doc)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md 
                                    text-blue-700 dark:text-blue-300 
                                    bg-blue-100 dark:bg-blue-900/30 
                                    hover:bg-blue-200 dark:hover:bg-blue-800/40 
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                    transition-colors duration-200"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Document
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="px-4 py-5 text-center text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
          No documents uploaded yet
        </div>
      )}
    </div>
  </div>
);

const TrainingList = ({ trainings, handleViewDocument }) => (
  <div className="bg-surface dark:bg-surface-dark shadow overflow-hidden sm:rounded-lg mt-6 border border-border-light dark:border-border-dark transition-colors duration-200">
    <div className="px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
        Training Records
      </h3>
      <p className="mt-1 max-w-2xl text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Training certifications and status
      </p>
    </div>
    <div className="border-t border-border-light dark:border-border-dark transition-colors duration-200">
      {trainings && trainings.length > 0 ? (
        <ul className="divide-y divide-border-light dark:divide-border-dark transition-colors duration-200">
          {trainings.map((training) => {
            const fileData = training.file || {};
            const typeInfo = getDocumentTypeInfo(fileData);
            const Icon = AcademicCapIcon; // Use academic cap icon for trainings

            // Get training name from the new nested object structure
            // Check if name is an object with trainingName property
            const trainingName =
              typeof training.name === 'object' && training.name !== null
                ? training.name.trainingName
                : (training.name || "Unknown Training");

            // Get training description if available
            const trainingDescription =
              typeof training.name === 'object' && training.name !== null
                ? training.name.description
                : '';

            return (
              <li key={training._id} className="px-4 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400 transition-colors duration-200" />
                      <div>
                        <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                          {trainingName}
                        </p>
                        {typeof training.name === 'object' && training.name?.trainingID && (
                          <p className="text-xs text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                            ID: {training.name.trainingID}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {trainingDescription && (
                        <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200 italic">
                          "{trainingDescription}"
                        </p>
                      )}
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                        Certificate Number: {training.certificateNumber}
                      </p>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                        Completed:{" "}
                        {training.completionDate
                          ? formatDate(training.completionDate)
                          : 'N/A'}
                      </p>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                        Expires:{" "}
                        {training.expiryDate
                          ? formatDate(training.expiryDate)
                          : "No expiry date"}
                      </p>
                      {fileData.fileName && (
                        <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                          File: {fileData.fileName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <DocumentStatus status={training.status} />

                    {fileData.fileUrl && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(fileData.downloadUrl, '_blank')}
                          className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors duration-200"
                          title="Download certificate"
                          aria-label={`Download ${fileData.fileName || 'certificate'}`}
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleViewDocument(training)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md 
                                    text-blue-700 dark:text-blue-300 
                                    bg-blue-100 dark:bg-blue-900/30 
                                    hover:bg-blue-200 dark:hover:bg-blue-800/40 
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                    transition-colors duration-200"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View Certificate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="px-4 py-5 text-center text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
          No training records found
        </div>
      )}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-200">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mb-4 transition-colors duration-200" />
      <p className="text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        Loading PA details...
      </p>
    </div>
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen bg-surface dark:bg-surface-dark transition-colors duration-200">
    <div className="text-center p-6 max-w-md">
      <ExclamationCircleIcon className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4 transition-colors duration-200" />
      <p className="text-text-primary dark:text-text-dark-primary font-medium mb-2 transition-colors duration-200">Error loading PA details</p>
      <p className="text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">{message}</p>
    </div>
  </div>
);

const PAView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openDocument, DocumentViewer } = useDocumentViewer();

  const {
    data: pa,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pa", id],
    queryFn: () => getPA(id),
    enabled: !!id,
  });

  // Fetch all trainings for mapping
  const {
    data: allTrainings,
    isLoading: trainingsLoading,
  } = useQuery({
    queryKey: ["trainings", "mapping"],
    queryFn: getAllTrainingsForMapping,
  });

  // Create training ID to name mapping
  const trainingNamesMap = useMemo(() => {
    if (!allTrainings) return {};
    
    return allTrainings.reduce((acc, training) => {
      acc[training._id] = training.trainingName;
      return acc;
    }, {});
  }, [allTrainings]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleEdit = useCallback(() => {
    navigate(`/pa/${id}/edit`);
  }, [navigate, id]);

  // Handle document viewing with proper URL conversion
  const handleViewDocument = useCallback((document) => {
    // Get file data from either the direct file property or the document itself
    const fileData = document.file || document;

    // Get the file URL, preferring fileUrl but falling back to other properties
    let viewUrl = fileData.fileUrl || document.fileUrl;

    // Handle Google Drive URLs
    if (viewUrl && viewUrl.includes('drive.google.com/file/d/')) {
      // Extract the file ID from the Google Drive URL
      const fileIdMatch = viewUrl.match(/\/file\/d\/([^\/]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        // For preview in the document viewer
        viewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    // Get file type information
    const typeInfo = getDocumentTypeInfo(document);

    openDocument(viewUrl, {
      title: document.type || typeInfo.displayType || 'Document',
      downloadUrl: fileData.downloadUrl || document.downloadUrl || viewUrl,
      type: document.type?.toLowerCase() || typeInfo.displayType.toLowerCase(),
      fileName: fileData.fileName || document.fileName || 'document',
      isImage: typeInfo.isImage,
      isGoogleDrive: viewUrl && viewUrl.includes('drive.google.com'),
      document: fileData
    });
  }, [openDocument]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message={error?.message} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-surface dark:bg-surface-dark transition-colors duration-200"
    >
      {/* Add Document Viewer Component */}
      <DocumentViewer />

      <div className="mb-6 flex justify-between items-center">
        <Button
          onClick={handleBack}
          className="flex items-center transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to PAs
        </Button>

        <Button
          onClick={handleEdit}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors duration-200"
        >
          Edit PA
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Main PA Information */}
        <PersonalDetails pa={pa} />

        {/* Documents with document viewer integration */}
        {pa?.documents && (
          <DocumentsList
            title="Personal Assistant Documents"
            documents={pa.documents}
            handleViewDocument={handleViewDocument}
          />
        )}

        {/* Trainings with document viewer integration */}
        {pa?.trainings && (
          <TrainingList
            trainings={pa.trainings}
            handleViewDocument={handleViewDocument}
          />
        )}

        {/* History Tracking */}
        {pa?.history && pa.history.length > 0 && (
          <HistoryTracker
            history={pa.history}
            title="PA History"
            subtitle="Record of PA modifications"
            entityType="pa"
            trainingNames={trainingNamesMap}
          />
        )}
      </div>
    </motion.div>
  );
};

export default PAView;