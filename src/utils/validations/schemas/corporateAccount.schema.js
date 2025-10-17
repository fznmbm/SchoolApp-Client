import * as Yup from 'yup';

export const corporateAccountValidationSchema = Yup.object().shape({
  // ID is server-generated; do not require from user
  corporateAccountID: Yup.string().nullable(),

  companyName: Yup.string()
    .required('Company Name is required')
    .trim()
    .max(100, 'Company Name must be at most 100 characters'),

  contact: Yup.object().shape({
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[+\d\s-()]+$/, 'Invalid phone number format'),

    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format')
      .trim()
      .max(100, 'Email must be at most 100 characters'),

    address: Yup.object().shape({
      street: Yup.string().trim().max(200, 'Street must be at most 200 characters'),
      city: Yup.string().trim().max(100, 'City must be at most 100 characters'),
      county: Yup.string().trim().max(100, 'County must be at most 100 characters'),
      postCode: Yup.string().trim().max(20, 'Post Code must be at most 20 characters'),
      country: Yup.string().trim().max(100, 'Country must be at most 100 characters')
        .default('United Kingdom')
    })
  })
});


