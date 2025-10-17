import * as Yup from 'yup';

export const adminValidationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string(),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: Yup.string()
    .nullable(),
  password: Yup.string()
    .when('isNewAdmin', {
      is: true,
      then: (schema) => schema.min(6, 'Password must be at least 6 characters').required('Password is required'),
      otherwise: (schema) => schema.min(6, 'Password must be at least 6 characters'),
    }),
  confirmPassword: Yup.string()
    .when('password', {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your password'),
    }),
});