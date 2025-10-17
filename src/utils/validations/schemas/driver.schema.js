import * as Yup from 'yup';

export const driverValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),

  shortName: Yup.string()
    .required('Short name is required')
    .min(2, 'Short name must be at least 2 characters')
    .max(50, 'Short name must not exceed 50 characters'),

  phoneNumber: Yup.string().nullable(),
  status: Yup.string()
    .oneOf(['ACTIVE', 'INACTIVE', 'ON_LEAVE'], 'Invalid status'),

  email: Yup.string()
    .email('Invalid email format')
    .nullable(),

  dateOfBirth: Yup.date()
    .nullable()
    .max(
      new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000),
      'Driver must be at least 18 years old'
    ),

  nationality: Yup.string()
    .nullable()
    .min(2, 'Nationality must be at least 2 characters')
    .max(50, 'Nationality must not exceed 50 characters'),

  address: Yup.object().shape({
    street: Yup.string()
      .nullable()
      .min(3, 'Street address must be at least 3 characters')
      .max(100, 'Street address must not exceed 100 characters'),

    city: Yup.string()
      .nullable()
      .min(2, 'City must be at least 2 characters')
      .max(50, 'City must not exceed 50 characters'),

    county: Yup.string()
      .nullable()
      .min(2, 'County must be at least 2 characters')
      .max(50, 'County must not exceed 50 characters'),

    postCode: Yup.string()
      .nullable(),

    country: Yup.string()
      .nullable()
      .default('United Kingdom')
  }).nullable(),

  emergencyContact: Yup.object().shape({
    name: Yup.string()
      .nullable()
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must not exceed 100 characters'),

    relationship: Yup.string()
      .nullable()
      .min(2, 'Relationship must be at least 2 characters')
      .max(50, 'Relationship must not exceed 50 characters'),

    phoneNumber: Yup.string()
      .nullable(),
  }).nullable(),

  documents: Yup.array().of(
    Yup.object().shape({
      type: Yup.string()
        .nullable()
        .oneOf([
          'DBS',
          'LICENSE',
          'TAXI_LICENSE',
          'MEDICAL_CERTIFICATE'
        ], 'Invalid document type'),

      number: Yup.string()
        .nullable()
        .min(3, 'Document number must be at least 3 characters')
        .max(50, 'Document number must not exceed 50 characters'),

      issuedDate: Yup.date()
        .nullable()
        .max(new Date(), 'Issue date cannot be in the future'),

      expiryDate: Yup.date()
        .nullable()
        .min(
          Yup.ref('issuedDate'),
          'Expiry date must be later than issue date'
        ),

      file: Yup.object().shape({
        fileUrl: Yup.string().nullable(),
        fileName: Yup.string().nullable()
      }).nullable(),
    })
  )
    .nullable()
    .default([]),

  vehicle: Yup.object().shape({
    registrationNumber: Yup.string()
      .nullable()
      .min(3, 'Registration number must be at least 3 characters')
      .max(20, 'Registration number must not exceed 20 characters'),

    type: Yup.string()
      .nullable()
      .oneOf(['SALOON', 'ESTATE', 'MPV', 'WAV'], 'Invalid vehicle type'),

    make: Yup.string()
      .nullable()
      .min(2, 'Make must be at least 2 characters')
      .max(50, 'Make must not exceed 50 characters'),

    model: Yup.string()
      .nullable()
      .min(2, 'Model must be at least 2 characters')
      .max(50, 'Model must not exceed 50 characters'),

    year: Yup.number()
      .nullable()
      .min(2000, 'Vehicle year must be 2000 or later')
      .max(new Date().getFullYear() + 1, 'Invalid vehicle year'),

    capacity: Yup.number()
      .nullable()
      .min(1, 'Capacity must be at least 1')
      .max(15, 'Capacity must not exceed 15'),

    documents: Yup.array().of(
      Yup.object().shape({
        type: Yup.string()
          .nullable()
          .oneOf(['LICENSE', 'INSURANCE', 'INSPECTION', 'MOT']),
        number: Yup.string().nullable(),
        issuedDate: Yup.date().nullable(),
        expiryDate: Yup.date()
          .nullable()
          .min(Yup.ref('issuedDate')),
        file: Yup.object().shape({
          fileUrl: Yup.string().nullable(),
          fileName: Yup.string().nullable()
        }).nullable(),
      })
    ).nullable().default([]),
  }).nullable(),

  trainings: Yup.array()
    .nullable()
    .default([])
});

export default driverValidationSchema;