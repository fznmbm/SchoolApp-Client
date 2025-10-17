import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getRoute } from "@/services/route";
import { motion } from "framer-motion";
import { ThemeContext } from "@/context/ThemeContext";
import RouteHeader from "@components/route/RouteHeader";
import RouteInformation from "@components/route/RouteInformation";
import VendorSection from "@components/route/VendorSection";
import RoutePlannerSection from "@components/route/RoutePlannerSection";
import ScheduleSection from "@components/route/ScheduleSection";
import StaffSection from "@components/route/StaffSection";
import StopsSection from "@components/route/StopsSection";
import SpecialServicesSection from "@components/route/SpecialServicesSection";
import DayWiseStudentsSection from "@components/route/DayWiseStudentsSection";
import PricingSection from "@components/route/PricingSection";
import { useDocumentViewer } from "@/components/common/DocumentViewer";
import { HistoryTracker } from "@/components/common/HistoryTracker";
import {
  DocumentIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

const RouteView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const { openDocument, DocumentViewer } = useDocumentViewer();

  // Query for route data
  const {
    data: route,
    isLoading,
    isError,
    error: routeError,
  } = useQuery({
    queryKey: ["route", id],
    queryFn: () => getRoute(id),
    enabled: !!id,
  });

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get document type info
  const getDocumentTypeInfo = (document) => {
    const type = document.type || 'OTHER';
    const mimeType = document.fileMimeType || '';

    // Default values
    let icon = DocumentIcon;
    let displayType = 'Document';
    let color = 'text-gray-500 dark:text-gray-400';
    let isImage = false;

    // Check by MIME type first
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

    // Then check by route document type
    switch (type) {
      case 'ROUTE_MAP':
        // Hide route-map specific label in UI
        displayType = 'Document';
        break;
      case 'CONTRACT':
        displayType = 'Contract';
        break;
      case 'AGREEMENT':
        displayType = 'Agreement';
        break;
      case 'APPROVAL':
        displayType = 'Approval';
        break;
      default:
        // Keep default if not specified
        break;
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
      title: document.fileName || 'Route Document',
      downloadUrl: document.downloadUrl,
      type: typeInfo.displayType.toLowerCase(),
      fileName: document.fileName,
      isImage: typeInfo.isImage,
      document: document
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">Loading route details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center p-8 text-red-500 dark:text-red-400">
        Error loading route: {routeError.message}
      </div>
    );
  }

  // Get all special services organized by student
  const getAllSpecialServices = () => {
    if (!route || !route.stops) return [];

    const allServices = [];

    // Helper function to extract special services from stop students
    const extractSpecialServices = (stop, stopType) => {
      if (!stop || !stop.students) return;

      stop.students.forEach(studentEntry => {
        if (!studentEntry.specialServices || !studentEntry.specialServices.length) return;

        // Only include active services
        const activeServices = studentEntry.specialServices.filter(service => service.isActive !== false);
        if (!activeServices.length) return;

        const studentName = studentEntry.student.firstName + ' ' + studentEntry.student.lastName;

        activeServices.forEach(service => {
          allServices.push({
            studentId: studentEntry.student._id,
            studentName,
            stopLocation: stop.location,
            stopType,
            service
          });
        });
      });
    };

    // Extract from all stops
    extractSpecialServices(route.stops.startingStop, 'Starting Stop');
    route.stops.intermediateStops.forEach((stop, index) => {
      extractSpecialServices(stop, `Stop ${index + 1}`);
    });
    extractSpecialServices(route.stops.endingStop, 'Ending Stop');

    return allServices;
  };

  const specialServices = getAllSpecialServices();
  
  // Build student ID -> name map for history rendering (special services)
  const buildStudentNameMap = () => {
    const map = {};
    const addFromStop = (stop) => {
      if (!stop || !Array.isArray(stop.students)) return;
      stop.students.forEach((entry) => {
        const st = entry && entry.student;
        if (st && typeof st === 'object' && st._id) {
          const first = st.firstName || '';
          const last = st.lastName || '';
          const full = `${first} ${last}`.trim();
          if (full) map[String(st._id)] = full;
        }
      });
    };
    addFromStop(route.stops.startingStop);
    route.stops.intermediateStops.forEach(addFromStop);
    addFromStop(route.stops.endingStop);
    return map;
  };
  const studentNameMap = buildStudentNameMap();
  const hasDocuments = route.documents && route.documents.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto transition-colors duration-300 ease-in-out"
      data-testid="route-view"
    >
      {/* Document Viewer Component - Renders the modal when a document is opened */}
      <DocumentViewer />

      {/* Header */}
      <RouteHeader id={id} route={route}/>
      <div className="grid gap-6">
        {/* Basic Information */}
        <RouteInformation route={route} />

        {/* Route Documents Section - Inline implementation */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Route Documents</h3>
            <div className="mt-4">
              {hasDocuments ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {route.documents.map((document, index) => {
                    const typeInfo = getDocumentTypeInfo(document);
                    const Icon = typeInfo.icon;
                    return (
                      <div
                        key={index}
                        className="flex flex-col border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
                            <p>Uploaded: {formatDate(document.uploadedAt || document.createdAt)}</p>
                            {document.status && (
                              <p className="mt-1 flex items-center">
                                Status: <span className="ml-1">
                                  {document.status}
                                </span>
                              </p>
                            )}
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
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <DocumentIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No documents have been uploaded for this route</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vendor Information */}
        <VendorSection vendor={route.vendor} />

        {/* Route Planner */}
        <RoutePlannerSection routePlanner={route.routePlanner} />

        {/* Schedule */}
        <ScheduleSection operatingDays={route.operatingDays} />

        {/* Staff Section */}
        <StaffSection route={route} routeId={id} />

        {/* Stops */}
        <StopsSection stops={route.stops} />

        {/* Special Services */}
        <SpecialServicesSection specialServices={specialServices} />

        {/* Day-wise Students */}
        <DayWiseStudentsSection dayWiseStudents={route.dayWiseStudents} />

        {/* Pricing */}
        <PricingSection route={route} />

      {/* History */}
      {Array.isArray(route.history) && route.history.length > 0 && (
        <HistoryTracker
          history={route.history}
          title="Route History"
          subtitle="Record of route modifications"
          entityType="route"
          idToNameMap={{
            ...(route?.permanentDriver?._id ? { [String(route.permanentDriver._id)]: route.permanentDriver.name } : {}),
            ...(route?.pa?._id ? { [String(route.pa._id)]: route.pa.name } : {}),
            ...(route?.temporaryDriver?.driver?._id ? { [String(route.temporaryDriver.driver._id)]: route.temporaryDriver.driver.name } : {}),
            ...studentNameMap,
          }}
        />
      )}
      </div>
    </motion.div>
  );
};

export default RouteView;