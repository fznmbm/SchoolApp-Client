import * as Yup from 'yup';

export const parentValidationSchema = Yup.object().shape({
  name: Yup.string().nullable(),
  relationship: Yup.string().nullable()
    .oneOf(['father', 'mother', 'guardian'], 'Invalid relationship'),
  phone: Yup.string().nullable(),
  whatsapp: Yup.string()
    .nullable(),
  address: Yup.object().shape({
    street: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    zipCode: Yup.string()
  })
});