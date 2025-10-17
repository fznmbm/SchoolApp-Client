import * as Yup from 'yup';

export const schoolValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('School name is required')
    .min(2, 'School name must be at least 2 characters')
    .max(100, 'School name must be less than 100 characters')
    .trim(),

  address: Yup.object().shape({
    street: Yup.string()
      .min(5, 'Street address must be at least 5 characters')
      .max(100, 'Street address must be less than 100 characters')
      .trim(),

    city: Yup.string()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City must be less than 50 characters')
      .trim(),

    county: Yup.string()
      .min(2, 'County must be at least 2 characters')
      .max(50, 'County must be less than 50 characters')
      .trim(),

    postCode: Yup.string()
      .trim(),
  }),
  operatingHours: Yup.object({
    startTime: Yup.string(),
    endTime: Yup.string(),
  }),
  
  contact: Yup.object().shape({
    contactPerson: Yup.string()
      .min(2, 'Contact person name must be at least 2 characters')
      .max(100, 'Contact person name must be less than 100 characters')
      .trim(),

    phone: Yup.string()
      .trim(),

    email: Yup.string()
      .email('Invalid email address')
      .trim()
      .lowercase(),
  }),


  isActive: Yup.boolean()
    .default(true),
});