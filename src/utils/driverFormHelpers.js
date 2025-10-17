export const DRIVER_STATUS = [
  { id: "ACTIVE", name: "Active" },
  { id: "INACTIVE", name: "Inactive" },
  { id: "SUSPENDED", name: "Suspended" },
  { id: "ON_LEAVE", name: "On Leave" },
];

// Document types moved to DocumentUpdateModal component

export const VEHICLE_TYPES = [
  { id: "SALOON", name: "Saloon" },
  { id: "ESTATE", name: "Estate" },
  { id: "MPV", name: "MPV" },
  { id: "WAV", name: "WAV" },
];

export const prepareInitialValues = (initialData) => {
  return {
    name: initialData?.name || "",
    shortName: initialData?.shortName || "",
    phoneNumber: initialData?.phoneNumber || null,
    email: initialData?.email || null,
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      county: initialData?.address?.county || "",
      postCode: initialData?.address?.postCode || "",
      country: initialData?.address?.country || "United Kingdom",
    },
    dateOfBirth: initialData?.dateOfBirth
      ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
      : "",
    nationality: initialData?.nationality || "",
    emergencyContact: {
      name: initialData?.emergencyContact?.name || "",
      relationship: initialData?.emergencyContact?.relationship || "",
      phoneNumber: initialData?.emergencyContact?.phoneNumber || "",
    },
    status: initialData?.status || "ACTIVE",
    trainings: initialData?.trainings?.length ? initialData.trainings.map(training => ({
      training: training.training?._id || training.training || "",
      completionDate: training.completionDate
        ? new Date(training.completionDate).toISOString().split("T")[0]
        : "",
      certificateNumber: training.certificateNumber || "",
      expiryDate: training.expiryDate
        ? new Date(training.expiryDate).toISOString().split("T")[0]
        : "",
      documentUrl: training.file?.fileUrl || "",
      // If there is an existing file object from the server, pre-fill it so FileUpload shows it
      file: (training.file && training.file.fileName) ? training.file : null,
    })) : [
      {
        training: "",
        completionDate: "",
        certificateNumber: "",
        expiryDate: "",
        documentUrl: "",
        file: null,
        description: "", 
      },
    ],
    documents: [],
    vehicle: {
      registrationNumber: initialData?.vehicle?.registrationNumber || "",
      type: initialData?.vehicle?.type || null,
      make: initialData?.vehicle?.make || "",
      model: initialData?.vehicle?.model || "",
      year: initialData?.vehicle?.year ? String(initialData.vehicle.year) : "",
      capacity: initialData?.vehicle?.capacity
        ? String(initialData.vehicle.capacity)
        : "",
      documents: [],
    },
  };
};

export const transformFormData = (values) => {
  // Create a deep copy to avoid mutating the original values
  const driverData = JSON.parse(JSON.stringify(values));
  
  // Document handling removed - now handled separately
  
  // Process training records
  if (driverData.trainings) {
    driverData.trainings = driverData.trainings
      .filter(training => training.training)
      .map((training, idx) => {
        const original = values.trainings[idx];
        const fileValue = original?.file;

        return {
          training: training.training,
          completionDate: training.completionDate || null,
          certificateNumber: training.certificateNumber || "",
          expiryDate: training.expiryDate || null,
          // Only pass a real File to the service for upload; keep existing file objects out of payload
          file: fileValue instanceof File ? fileValue : null,
          // If user explicitly cleared the file (empty string), request removal
          removeFile: fileValue === ""
        };
      });
  }
  
  // Convert year and capacity to numbers if provided
  if (driverData.vehicle) {
    if (driverData.vehicle.year) {
      driverData.vehicle.year = Number(driverData.vehicle.year);
    }
    
    if (driverData.vehicle.capacity) {
      driverData.vehicle.capacity = Number(driverData.vehicle.capacity);
    }
  }
  
  return driverData;
};