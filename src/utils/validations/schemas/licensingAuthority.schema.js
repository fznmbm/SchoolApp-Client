import * as Yup from 'yup';

export const licensingAuthorityValidationSchema = Yup.object().shape({
  licensingAuthorityID: Yup.string()
    .required('Authority ID is required')
    .trim()
    .max(50, 'Authority ID must be at most 50 characters'),
  
  authorityName: Yup.string()
    .required('Authority Name is required')
    .trim()
    .max(100, 'Authority Name must be at most 100 characters'),
  
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
      street: Yup.string()
        .trim()
        .max(200, 'Street address must be at most 200 characters'),
      
      city: Yup.string()
        .trim()
        .max(100, 'City must be at most 100 characters'),
      
      county: Yup.string()
        .trim()
        .max(100, 'County must be at most 100 characters'),
      
      postCode: Yup.string()
        .trim()
        .max(20, 'Post Code must be at most 20 characters'),
      
      country: Yup.string()
        .trim()
        .max(100, 'Country must be at most 100 characters')
        .default('United Kingdom')
    })
  })
});