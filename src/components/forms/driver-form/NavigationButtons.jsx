import React, { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';
import Button from '@/components/common/Button';
import { useFormikContext } from 'formik';

const NavigationButtons = ({ step, setStep, isSubmitting, isPending, onCancel }) => {
  const { theme } = useContext(ThemeContext);
  const { validateForm, setTouched, submitForm } = useFormikContext();

  const handleNext = async (e) => {
    e.preventDefault(); 

    let fieldsToValidate = {};

    switch (step) {
      case 1: 
        fieldsToValidate = {
          name: true,
          shortName: true, 
          phoneNumber: true,
          email: true,
          dateOfBirth: true,
          nationality: true,
          address: true,
          emergencyContact: true
        };
        break;
      case 2: 
        fieldsToValidate = { 
          'vehicle.registrationNumber': true,
          'vehicle.type': true,
          'vehicle.make': true,
          'vehicle.model': true,
          'vehicle.year': true,
          'vehicle.capacity': true
        };
        break;
      case 3:
        fieldsToValidate = { 'trainings': true };
        break;
      default:
        break;
    }

    setTouched(fieldsToValidate);

    const formErrors = await validateForm();

    const hasStepErrors = Object.keys(formErrors).some(key => {
      switch (step) {
        case 1:
          return key === 'name' || key === 'shortName' || key === 'phoneNumber' || key === 'email' || 
                 key === 'dateOfBirth' || key === 'nationality' || 
                 key === 'address' || key === 'emergencyContact';
        case 2:
          return key === 'vehicle' && typeof formErrors.vehicle === 'object' && 
                 Object.keys(formErrors.vehicle).some(vehicleKey => 
                   vehicleKey !== 'documents');
        case 3:
          return key === 'trainings';
        default:
          return false;
      }
    });

    if (!hasStepErrors) {
      setStep(step + 1);
    }
  };


  const markAllErrorsTouched = (errs) => {
    if (Array.isArray(errs)) return errs.map(markAllErrorsTouched);
    if (errs && typeof errs === 'object') {
      const out = {};
      for (const k in errs) out[k] = markAllErrorsTouched(errs[k]);
      return out;
    }
    return true;
  };

  const findFirstErrorPath = (errs, prefix = '') => {
    if (!errs) return null;
    if (typeof errs === 'string') return prefix || null;
    if (Array.isArray(errs)) {
      for (let i = 0; i < errs.length; i++) {
        const p = findFirstErrorPath(errs[i], `${prefix}${prefix ? '.' : ''}${i}`);
        if (p) return p;
      }
      return null;
    }
    if (typeof errs === 'object') {
      for (const key of Object.keys(errs)) {
        const p = findFirstErrorPath(errs[key], `${prefix}${prefix ? '.' : ''}${key}`);
        if (p) return p;
      }
    }
    return null;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = await validateForm();
    if (errs && Object.keys(errs).length > 0) {
      setTouched(markAllErrorsTouched(errs), false);
      const firstPath = findFirstErrorPath(errs);
      if (firstPath) {
        const el = document.querySelector(`[name="${firstPath}"]`);
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (el && el.focus) el.focus();
      }
      return;
    }
    submitForm();
  };

  return (
    <div className="pt-6 flex justify-between">
      <div>
        {step > 1 ? (
          <Button
            variant="outline"
            size="md"
            onClick={() => setStep(step - 1)}
            aria-label="Go to previous step"
            type="button" 
          >
            Back
          </Button>
        ) : (
          onCancel && (
            <Button
              variant="outline"
              size="md"
              onClick={onCancel}
              aria-label="Cancel and return to list"
              type="button" 
            >
              Cancel
            </Button>
          )
        )}
      </div>
      
      <div className="flex space-x-3">
        {step === 3 && onCancel && (
          <Button
            variant="light"
            size="md"
            onClick={onCancel}
            aria-label="Cancel and return to list"
            type="button" 
          >
            Cancel
          </Button>
        )}
        
        {step < 3 ? (
          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            aria-label="Go to next step"
            type="button" 
          >
            Next
          </Button>
        ) : (
          <Button
            size="md"
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting || isPending}
            aria-label="Submit form"
          >
            {isSubmitting || isPending ? "Submitting..." : "Submit"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationButtons;