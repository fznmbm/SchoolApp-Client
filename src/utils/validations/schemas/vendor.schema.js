import * as Yup from 'yup';

export const vendorValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
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
      .min(5, 'Post Code must be at least 5 characters')
      .max(10, 'Post Code must be less than 10 characters')
      .trim(),

    country: Yup.string()
      .required('Country is required')
      .default('United Kingdom'),
  }),

  contact: Yup.object().shape({
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]+$/, 'Phone number must be a valid number')
      .min(8, 'Phone number must be at least 8 digits')
      .max(20, 'Phone number must be less than 20 digits'),

    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address')
      .trim()
      .lowercase(),
  }),

  status: Yup.string()
    .oneOf(['Active', 'Inactive'])
    .default('Active'),
});