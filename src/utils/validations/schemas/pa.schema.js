import * as Yup from 'yup';

export const paValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  shortName: Yup.string()
    .required('Short Name is required')
    .min(2, 'Short Name must be at least 2 characters')
    .max(50, 'Short Name must be less than 50 characters')
    .trim(),

  address: Yup.object().shape({
    street: Yup.string()
      .required('Street address is required')
      .min(5, 'Street address must be at least 5 characters')
      .max(100, 'Street address must be less than 100 characters')
      .trim(),

    city: Yup.string()
      .required('City is required')
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City must be less than 50 characters')
      .trim(),

    county: Yup.string()
      .required('County is required')
      .min(2, 'County must be at least 2 characters')
      .max(50, 'County must be less than 50 characters')
      .trim(),

    postCode: Yup.string()
      .required('Post Code is required')
      .trim(),

    country: Yup.string()
      .required('Country is required')
      .default('United Kingdom'),
  }),

  contact: Yup.object().shape({
    phone: Yup.string()
      .required('Phone number is required')
      .trim(),

    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address')
      .trim()
      .lowercase(),
  }),

  documents: Yup.array().of(
    Yup.object().shape({
      type: Yup.string()
        .required('Document type is required')
        .oneOf(['DBS'], 'Invalid document type'),
      
      number: Yup.string()
        .required('Document number is required')
        .min(6, 'Document number must be at least 6 characters')
        .max(20, 'Document number must be less than 20 characters')
        .trim(),

      issuedDate: Yup.date()
        .required('Issue date is required')
        .max(new Date(), 'Issue date cannot be in the future'),

      expiryDate: Yup.date()
        .required('Expiry date is required')
        .min(Yup.ref('issuedDate'), 'Expiry date must be after issue date'),

      fileUrl: Yup.string().nullable(),
      file: Yup.mixed().nullable(),
    })
  ).min(1, 'At least one document is required'),

  trainings: Yup.array().of(
    Yup.object().shape({
      nameId: Yup.string()
        .required('Training type is required'),

      completionDate: Yup.date()
        .when('nameId', {
          is: (nameId) => nameId && nameId.length > 0,
          then: (schema) => schema.required('Completion date is required').max(new Date(), 'Completion date cannot be in the future'),
          otherwise: (schema) => schema.nullable(),
        }),

      certificateNumber: Yup.string()
        .when('nameId', {
          is: (nameId) => nameId && nameId.length > 0,
          then: (schema) => schema.required('Certificate number is required').min(4, 'Certificate number must be at least 4 characters').max(50, 'Certificate number must be less than 50 characters'),
          otherwise: (schema) => schema.nullable(),
        }),

      expiryDate: Yup.date()
        .when('nameId', {
          is: (nameId) => nameId && nameId.length > 0,
          then: (schema) => schema.required('Expiry date is required').min(Yup.ref('completionDate'), 'Expiry date must be after completion date'),
          otherwise: (schema) => schema.nullable(),
        }),

      file: Yup.mixed().nullable(),
    })
  ),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['ACTIVE', 'INACTIVE'], 'Invalid status')
    .default('ACTIVE'),
});