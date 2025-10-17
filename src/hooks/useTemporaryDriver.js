import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { 
  assignTemporaryDriver, 
  removeTemporaryDriver,
  getTemporaryDriverHistory 
} from "@/services/route";
import { getDriversByCapacity } from "@/services/drivers";

export const useTemporaryDriver = (route, routeId) => {
  const queryClient = useQueryClient();
  
  // State for temporary driver form
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    driverId: "",
    startDate: "",
    endDate: "",
    timeOfDay: "BOTH", // Default to BOTH
    price: "",
    reason: ""
  });
  const [error, setError] = useState(null);

  // Compute active/scheduled temporary driver assignments (array + legacy single field)
  const computeActiveAssignments = useCallback(() => {
    const today = new Date();
    const list = [];
    if (Array.isArray(route.temporaryDrivers)) {
      list.push(...route.temporaryDrivers);
    }
    if (route.temporaryDriver && route.temporaryDriver.driver) {
      list.push(route.temporaryDriver);
    }
    // filter out completed ones for the main section
    return list.filter((a) => {
      if (!a || !a.startDate || !a.endDate) return false;
      const end = new Date(a.endDate);
      return end >= new Date(today.toDateString());
    });
  }, [route]);

  const activeAssignments = computeActiveAssignments();
  const hasTemporaryDriver = activeAssignments.length > 0;

  // Query for available drivers for temporary assignment
  const { data: driversData } = useQuery({
    queryKey: ['drivers', route?.capacity],
    queryFn: () => getDriversByCapacity({ capacity: route?.capacity }),
    enabled: showAssignForm, // Only fetch when form is shown
  });

  // Query for assignment history
  const { data: historyData } = useQuery({
    queryKey: ["temporaryDriverHistory", routeId],
    queryFn: () => getTemporaryDriverHistory(routeId),
    enabled: showHistory, // Only fetch when history is shown
  });

  // Filter available drivers to exclude the permanent driver for temporary assignment
  const availableDriversForTemp = driversData?.filter(driver =>
    driver._id !== route.permanentDriver?._id
  ) || [];

  // Mutation for assigning temporary driver
  const assignMutation = useMutation({
    mutationFn: (data) => assignTemporaryDriver(routeId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["route", routeId]);
      // Invalidate the assigned driver's details so it reflects new temp assignment
      const assignedDriverId = variables?.driverId;
      if (assignedDriverId) {
        queryClient.invalidateQueries(["driver", String(assignedDriverId)]);
      }
      setShowAssignForm(false);
      resetAssignmentForm();
      setError(null);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to assign temporary driver");
    }
  });

  // Mutation for removing temporary driver
  const removeMutation = useMutation({
    mutationFn: ({ reason, assignmentId }) => removeTemporaryDriver(routeId, { reason, assignmentId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["route", routeId]);

      // Invalidate the impacted driver's page
      let impactedDriverId = null;
      if (variables?.assignmentId && Array.isArray(route.temporaryDrivers)) {
        const match = route.temporaryDrivers.find(a => a._id === variables.assignmentId);
        impactedDriverId = match?.driver?._id || null;
      }
      if (!impactedDriverId && route?.temporaryDriver?.driver?._id) {
        impactedDriverId = route.temporaryDriver.driver._id;
      }
      if (impactedDriverId) {
        queryClient.invalidateQueries(["driver", String(impactedDriverId)]);
      }

      setShowRemoveForm(false);
      setError(null);
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Failed to remove temporary driver");
    }
  });

  // Reset assignment form
  const resetAssignmentForm = useCallback(() => {
    setAssignmentForm({
      driverId: "",
      startDate: "",
      endDate: "",
      timeOfDay: "BOTH",
      price: "",
      reason: ""
    });
  }, []);

  // Handle form input changes
  const handleAssignmentFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setAssignmentForm(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle assignment form submission
  const handleAssignmentSubmit = useCallback((e) => {
    e.preventDefault();
    setError(null);
    assignMutation.mutate(assignmentForm);
  }, [assignMutation, assignmentForm]);

  // Handle remove form submission
  const handleRemoveSubmit = useCallback((e) => {
    e.preventDefault();
    removeMutation.mutate({ reason: assignmentForm.reason, assignmentId: selectedAssignmentId });
  }, [removeMutation, assignmentForm.reason, selectedAssignmentId]);

  // Open/close forms
  const openAssignForm = useCallback(() => {
    setShowAssignForm(true);
    setShowRemoveForm(false);
    setShowHistory(false);
  }, []);

  const openRemoveForm = useCallback((assignmentId) => {
    setSelectedAssignmentId(assignmentId || null);
    setShowRemoveForm(true);
    setShowAssignForm(false);
    setShowHistory(false);
  }, []);

  const toggleHistory = useCallback(() => {
    setShowHistory(prev => !prev);
    setShowRemoveForm(false);
    setShowAssignForm(false);
  }, []);

  const closeAllForms = useCallback(() => {
    setShowRemoveForm(false);
    setShowAssignForm(false);
    setError(null);
    setSelectedAssignmentId(null);
  }, []);

  // First, process the history data to only show latest record per date range
  const getLatestAssignmentHistory = useCallback((historyData) => {
    if (!historyData || historyData.length === 0) return [];

    // Create a map to group by date range
    const dateRangeMap = new Map();

    // Group assignments by their date range and find the latest for each
    historyData.forEach(item => {
      const dateRangeKey = `${item.startDate}_${item.endDate}_${item.driver._id}`;

      if (!dateRangeMap.has(dateRangeKey) ||
        new Date(item.assignedAt) > new Date(dateRangeMap.get(dateRangeKey).assignedAt)) {
        dateRangeMap.set(dateRangeKey, item);
      }
    });

    // Convert map values back to array and sort by date (most recent first)
    return Array.from(dateRangeMap.values())
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, []);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString();
  }, []);

  return {
    hasTemporaryDriver,
    activeAssignments,
    showAssignForm,
    showRemoveForm,
    showHistory,
    assignmentForm,
    error,
    availableDriversForTemp,
    historyData,
    isAssigning: assignMutation.isLoading,
    isRemoving: removeMutation.isLoading,
    handleAssignmentFormChange,
    handleAssignmentSubmit,
    handleRemoveSubmit: (e) => handleRemoveSubmit(e, selectedAssignmentId),
    openAssignForm,
    openRemoveForm,
    toggleHistory,
    closeAllForms,
    getLatestAssignmentHistory,
    formatDate
  };
};