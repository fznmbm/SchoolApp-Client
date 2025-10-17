import * as Yup from 'yup';


export const routeValidationSchema = Yup.object().shape({
  // Basic Details
  name: Yup.string().required('Route name is required'),
  routeNo: Yup.string().required('Route number is required'),
  capacity: Yup.string().nullable(),
  vendor: Yup.string(),
  
  // Optional fields
  poNumber: Yup.string(),
  paPoNumber: Yup.string(),
  invoiceTemplate: Yup.string(),
  description: Yup.string(),
  
  routePlanner: Yup.object().shape({
    name: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email('Invalid email')
  }),
  operatingDays: Yup.array(),

  // Staff & Pricing
  permanentDriver: Yup.string(), 
  isPANeeded: Yup.boolean(),
  pa: Yup.string().when('isPANeeded', {
    is: true,
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.nullable()
  }),
  pricePerMile: Yup.number().nullable().transform((value) => (isNaN(value) ? undefined : value)),
  dailyPrice: Yup.number().nullable().transform((value) => (isNaN(value) ? undefined : value)),
  driverPrice: Yup.number().nullable().transform((value) => (isNaN(value) ? undefined : value)),
  paPrice: Yup.number().nullable().transform((value) => (isNaN(value) ? undefined : value))
    .when('isPANeeded', {
      is: true,
      then: (schema) => schema.nullable(),
      otherwise: (schema) => schema.nullable()
    }),
  dailyMiles: Yup.number().nullable().transform((value) => (isNaN(value) ? undefined : value)),

  // Stops - Updated to match the actual form structure with timeAM and timePM
  stops: Yup.object().shape({
    startingStop: Yup.object().shape({
      location: Yup.string().required('Starting location is required'),
      timeAM: Yup.string().required('AM time is required'),
      timePM: Yup.string().required('PM time is required'),
      isSchool: Yup.boolean(),
      students: Yup.array().min(1, 'At least one student is required')
    }),
    endingStop: Yup.object().shape({
      location: Yup.string().required('Ending location is required'),
      timeAM: Yup.string().required('AM time is required'),
      timePM: Yup.string().required('PM time is required'),
      isSchool: Yup.boolean(),
      students: Yup.array().min(1, 'At least one student is required')
    }),
    intermediateStops: Yup.array().of(
      Yup.object().shape({
        location: Yup.string(),
        timeAM: Yup.string().when('location', {
          is: (val) => val && val.trim() !== '',
          then: (schema) => schema.required('AM time is required')
        }),
        timePM: Yup.string().when('location', {
          is: (val) => val && val.trim() !== '',
          then: (schema) => schema.required('PM time is required')
        }),
        isSchool: Yup.boolean(),
        students: Yup.array()
      })
    )
  }),
  
  // Other fields
  dayWiseStudents: Yup.array(),
  documents: Yup.mixed().nullable(),
  documentMetadata: Yup.array()
});