import React, { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getDriver, 
  updateDriverDocument, 
  updateVehicleDocument,
  deleteDriverDocument,
  deleteVehicleDocument
} from "@/services/drivers";
import { Button } from "@/components/common/Button";
import { motion } from "framer-motion";
import { ArrowLeftIcon, ReceiptPercentIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

import DriverDetailsCard from "@/components/driver/DriverDetailsCard";
import VehicleDetailsCard from "@components/driver/VehicleDetailsCard";
import EmergencyContactCard from "@components/driver/EmergencyContactCard";
import PermanentRoutes from "@components/driver/PermanentRoutes";
import TemporaryAssignments from "@components/driver/TemporaryAssignments";
import ActiveJobs from "@components/driver/ActiveJobs";
import DocumentsList from "@components/driver/DocumentsList";
import TrainingList from "@components/driver/TrainingList";
import InvoiceGenerator from '@components/driver/InvoiceGenerator';
import RequestDocuments from '@components/driver/RequestDocuments';
import { HistoryTracker } from '@components/common/HistoryTracker';
import { DriverHistory } from '@components/driver/DriverHistory';
import { getAllTrainingsForMapping } from "@/services/training";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const DriverView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [showRequestDocs, setShowRequestDocs] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: driver,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["driver", id],
    queryFn: () => getDriver(id),
    enabled: !!id,
  });

  // Fetch all trainings for mapping (to display training names instead of ObjectIds in history)
  const { data: allTrainings } = useQuery({
    queryKey: ["trainings", "mapping"],
    queryFn: getAllTrainingsForMapping,
  });

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
    navigate(`/drivers/${id}/edit`);
  }, [navigate, id]);

  const toggleInvoiceGenerator = useCallback(() => {
    setShowInvoiceGenerator(prev => !prev);
  }, []);

  // Mutation for updating driver documents
  const updateDriverDocumentMutation = useMutation({
    mutationFn: ({ documentType, documentData }) => 
      updateDriverDocument(id, documentType, documentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['driver', id]);
    }
  });

  // Mutation for updating vehicle documents
  const updateVehicleDocumentMutation = useMutation({
    mutationFn: ({ documentType, documentData }) => 
      updateVehicleDocument(id, documentType, documentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['driver', id]);
    }
  });

  // Mutation for deleting driver documents
  const deleteDriverDocumentMutation = useMutation({
    mutationFn: (documentType) => deleteDriverDocument(id, documentType),
    onSuccess: () => {
      queryClient.invalidateQueries(['driver', id]);
    }
  });

  // Mutation for deleting vehicle documents
  const deleteVehicleDocumentMutation = useMutation({
    mutationFn: (documentType) => deleteVehicleDocument(id, documentType),
    onSuccess: () => {
      queryClient.invalidateQueries(['driver', id]);
    }
  });

  const handleDocumentUpdate = useCallback(async (driverId, documentType, documentData, isVehicle) => {
    try {
      if (isVehicle) {
        await updateVehicleDocumentMutation.mutateAsync({ documentType, documentData });
      } else {
        await updateDriverDocumentMutation.mutateAsync({ documentType, documentData });
      }
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }, [updateDriverDocumentMutation, updateVehicleDocumentMutation]);

  const handleDocumentDelete = useCallback(async (driverId, documentType, isVehicle) => {
    try {
      if (isVehicle) {
        await deleteVehicleDocumentMutation.mutateAsync(documentType);
      } else {
        await deleteDriverDocumentMutation.mutateAsync(documentType);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }, [deleteDriverDocumentMutation, deleteVehicleDocumentMutation]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-500 rounded-full transition-colors duration-200"
          role="status"
          aria-label="Loading driver details"
        />
        <span className="sr-only">Loading driver details...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        className="text-center p-6"
        role="alert"
      >
        <div className="inline-block p-4 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-700 dark:text-red-300 transition-colors duration-200">
          <p className="text-lg font-medium mb-2">Error loading driver details</p>
          <p className="text-sm">{error?.message || 'An unexpected error occurred'}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="p-6 transition-colors duration-200"
    >
      <div className="mb-6 flex justify-between items-center">
        <Button onClick={handleBack} className="flex items-center">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Drivers
        </Button>
        <div className="flex space-x-3">
          <Button
            onClick={toggleInvoiceGenerator}
            variant="secondary"
          >
            <ReceiptPercentIcon className="w-5 h-5 mr-2" />
            Generate Invoice
          </Button>
          <Button
            onClick={() => setShowRequestDocs(true)}
            variant="outline"
          >
            Request Documents
          </Button>
          <Button
            onClick={handleEdit}
            variant="primary"
          >
            Edit Driver
          </Button>
        </div>
      </div>

      {driver.isCurrentlyWorking && (
        <div className="mb-4 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 px-4 py-3 rounded-md flex items-center transition-colors duration-200">
          <BriefcaseIcon className="w-5 h-5 mr-2" />
          <span className="font-medium">Currently on duty</span> - This driver is actively working on {driver.activeJobs.length} job(s).
        </div>
      )}

      <div className="grid gap-6">
        {/* Invoice Generator Form */}
        <InvoiceGenerator
          driverId={id}
          isOpen={showInvoiceGenerator}
          onClose={() => setShowInvoiceGenerator(false)}
        />
        <RequestDocuments
          isOpen={showRequestDocs}
          onClose={() => setShowRequestDocs(false)}
          driver={driver}
        />
        
        {/* Main Cards */}
        <DriverDetailsCard driver={driver} />
        <VehicleDetailsCard vehicle={driver?.vehicle} />
        <EmergencyContactCard emergencyContact={driver?.emergencyContact} />
        
        {/* Route & Assignment Information */}
        <PermanentRoutes routes={driver.permanentRoutes} />
        <TemporaryAssignments assignments={driver.temporaryAssignments} />
        <ActiveJobs jobs={driver.activeJobs} />
        
        {/* Documents & Training */}
        <DocumentsList 
          title="Driver Documents" 
          documents={driver?.documents}
          driverId={id}
          onUpdateDocument={handleDocumentUpdate}
          onDeleteDocument={handleDocumentDelete}
        />
        {driver?.vehicle && (
          <DocumentsList
            title="Vehicle Documents"
            documents={driver?.vehicle?.documents}
            driverId={id}
            onUpdateDocument={handleDocumentUpdate}
            onDeleteDocument={handleDocumentDelete}
            isVehicleDocuments
          />
        )}
        {driver?.trainings && (<TrainingList trainings={driver.trainings} />)}
        
        {/* History */}
        {driver?.history && driver.history.length > 0 && (
          <HistoryTracker 
            history={driver.history}
            title="Driver History"
            subtitle="Record of driver and vehicle modifications"
            entityType="driver"
            trainingNames={trainingNamesMap}
          />
        )}
      </div>
    </motion.div>
  );
};

export default DriverView;