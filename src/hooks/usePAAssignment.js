import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { assignPAToRoute } from "@/services/route";
import { getAllPAs } from "@/services/pa";

export const usePAAssignment = (route, routeId) => {
  const queryClient = useQueryClient();
  const [showPAForm, setShowPAForm] = useState(false);
  const [paForm, setPAForm] = useState({
    isPANeeded: false,
    paId: "",
    paPrice: "",
  });
  const [paError, setPAError] = useState(null);

  // Query for all PAs
  const { data } = useQuery({
    queryKey: ['pas'],
    queryFn: () => getAllPAs(),
    enabled: showPAForm // Only fetch when form is shown
  });
  
  // Extract the actual array from the API response
  // API responses often have format { data: [...] }
  const pasData = data?.data || [];

  // Effect to set initial values for forms when route data is loaded
  useEffect(() => {
    if (route) {
      setPAForm({
        isPANeeded: route.isPANeeded || false,
        paId: route.pa?._id || "",
        paPrice: route.paPrice || "",
      });
    }
  }, [route]);

  // Mutation for PA assignment
  const paAssignMutation = useMutation({
    mutationFn: (data) => assignPAToRoute(routeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["route", routeId]);
      setShowPAForm(false);
      setPAError(null);
    },
    onError: (err) => {
      setPAError(err.response?.data?.message || "Failed to update PA assignment");
    }
  });

  // Handle PA form input changes
  const handlePAFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setPAForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear PA and price when isPANeeded is toggled off
    if (name === 'isPANeeded' && !checked) {
      setPAForm(prev => ({
        ...prev,
        paId: "",
        paPrice: "",
        isPANeeded: false
      }));
    }
  }, []);

  // Handle PA form submission
  const handlePASubmit = useCallback((e) => {
    e.preventDefault();
    setPAError(null);
    paAssignMutation.mutate(paForm);
  }, [paAssignMutation, paForm]);

  const openPAForm = useCallback(() => {
    setShowPAForm(true);
  }, []);

  const closePAForm = useCallback(() => {
    setShowPAForm(false);
    setPAError(null);
  }, []);

  return {
    showPAForm,
    paForm,
    paError,
    pasData,
    isAssigning: paAssignMutation.isLoading,
    handlePAFormChange,
    handlePASubmit,
    openPAForm,
    closePAForm
  };
};