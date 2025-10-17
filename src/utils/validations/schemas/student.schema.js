import * as Yup from 'yup';
import { parentValidationSchema } from './parent.schema';

const specialCareNeedSchema = Yup.object().shape({
  type: Yup.string()
    .required('Special care need type is required')
    .trim(),
  description: Yup.string()
    .required('Description of special care need is required')
    .trim()
    .max(500, 'Description must be at most 500 characters'),
  fileUrl: Yup.string()
});

export const studentValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .trim(),
  lastName: Yup.string()
    .required('Last name is required')
    .trim(),
  grade: Yup.string().nullable(),
  school: Yup.string().nullable(),
  assignedRoute: Yup.string().nullable(),
  parents: Yup.array()
    .of(parentValidationSchema)
    .max(2, 'Maximum of two parents/guardians allowed')
    .nullable(),
  specialCareNeeds: Yup.array()
    .of(specialCareNeedSchema)
    .max(3, 'Maximum of 3 special care needs documents allowed'),
  isActive: Yup.boolean().default(true)
});