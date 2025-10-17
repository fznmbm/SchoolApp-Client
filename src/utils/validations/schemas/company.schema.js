import * as Yup from 'yup';

export const companySchema = Yup.object({
    name: Yup.string(),
    address: Yup.string(),
    phoneNumber: Yup.string(),
    email: Yup.string().email('Invalid email address'),
    vendorNumber: Yup.string(),
    tax: Yup.number()
      .min(0, 'Tax cannot be negative')
      .max(100, 'Tax cannot exceed 100%'),
    vatRegistrationNumber: Yup.string(),
    paymentMethod: Yup.string()
      .oneOf(['BACS', 'bank'], 'Invalid payment method'),
    accountNumber: Yup.string(),
    sortCode: Yup.string()
  });