import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { assignDriverToRoute } from "@/services/route";
import { getDriversByCapacity } from "@/services/drivers";

export const useDriverAssignment = (route, routeId) => {
  const queryClient = useQueryClient();
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [driverForm, setDriverForm] = useState({
    driverId: "",
    driverPrice: "",
  });
  const [driverError, setDriverError] = useState(null);

  // Query for available drivers
  const { data: driversData } = useQuery({
    queryKey: ['drivers', route?.capacity],
    queryFn: () => getDriversByCapacity({ capacity: route?.capacity }),
    enabled: showDriverForm, // Only fetch when form is shown
  });

  // Effect to set initial values for forms when route data is loaded
  useEffect(() => {
    if (route && route.permanentDriver) {
      setDriverForm({
        driverId: route.permanentDriver._id,
        driverPrice: route.driverPrice || "",
      });
    }
  }, [route]);

  // Mutation for assigning permanent driver
  const driverAssignMutation = useMutation({
    mutationFn: (data) => assignDriverToRoute(routeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["route", routeId]);
      setShowDriverForm(false);
      setDriverError(null);
    },
    onError: (err) => {
      setDriverError(err.response?.data?.message || "Failed to assign permanent driver");
    }
  });

  // Handle driver form input changes
  const handleDriverFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setDriverForm(prev => ({ ...prev, [name]: value }));
  }, []);

  // Handle driver form submission
  const handleDriverSubmit = useCallback((e) => {
    e.preventDefault();
    setDriverError(null);
    driverAssignMutation.mutate(driverForm);
  }, [driverAssignMutation, driverForm]);

  const openDriverForm = useCallback(() => {
    setShowDriverForm(true);
  }, []);

  const closeDriverForm = useCallback(() => {
    setShowDriverForm(false);
    setDriverError(null);
  }, []);

  return {
    showDriverForm,
    driverForm,
    driverError,
    driversData,
    isAssigning: driverAssignMutation.isLoading,
    handleDriverFormChange,
    handleDriverSubmit,
    openDriverForm,
    closeDriverForm
  };
};