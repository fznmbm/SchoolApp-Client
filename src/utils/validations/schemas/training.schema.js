import * as Yup from 'yup';

export const trainingValidationSchema = Yup.object().shape({
  trainingID: Yup.string()
    .required('Training ID is required')
    .trim()
    .max(50, 'Training ID must be at most 50 characters'),
  
  trainingName: Yup.string()
    .required('Training Name is required')
    .trim()
    .max(100, 'Training Name must be at most 100 characters'),
  
  candidateType: Yup.string()
    .required('Candidate Type is required')
    .oneOf(['Driver', 'PA'], 'Invalid Candidate Type'),
  
  description: Yup.string()
    .trim()
    .max(500, 'Description must be at most 500 characters')
    .nullable(),
  
  status: Yup.string()
    .oneOf(['Active', 'Inactive'], 'Invalid Status')
    .required('Status is required')
});