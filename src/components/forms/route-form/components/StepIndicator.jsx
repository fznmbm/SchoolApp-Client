import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { ThemeContext } from '@context/ThemeContext';
import { motion } from 'framer-motion';

const STEPS = [
  { step: 1, name: "Basic Details" },
  { step: 2, name: "Stops & Students" },
  { step: 3, name: "Special Services" }
];

const stepFields = {
  1: ['routeNo', 'name', 'poNumber', 'paPoNumber', 'description', 'routePlanner', 'operatingDays', 
      'isPANeeded', 'pricePerMile', 'dailyPrice', 'dailyMiles', 'capacity', 'vendor'],
  2: ['stops', 'dayWiseStudents'],
  3: [] 
};

const StepButton = ({ step, name, currentStep, isLast, onClick }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  const isCompleted = step < currentStep;
  const isActive = step === currentStep;
  
  const circleClasses = isCompleted
    ? "border-primary bg-primary text-text-inverse dark:border-primary-light dark:bg-primary-light"
    : isActive
    ? "border-primary bg-surface-secondary text-primary dark:border-primary-light dark:bg-surface-dark-secondary dark:text-primary-light"
    : "border-border-light bg-surface text-text-secondary dark:border-border-dark-mode dark:bg-surface-dark dark:text-text-dark-secondary";
    
  const textClasses = isCompleted || isActive
    ? "text-primary dark:text-primary-light"
    : "text-text-secondary dark:text-text-dark-secondary";
    
  const connectorClasses = isCompleted
    ? "bg-primary dark:bg-primary-light"
    : "bg-border-light dark:bg-border-dark-mode";

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type="button"
      className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light focus:ring-offset-2 dark:focus:ring-offset-surface-dark rounded-md transition-colors duration-200"
      aria-current={isActive ? "step" : undefined}
      aria-label={`Go to step ${step}: ${name}`}
    >
      <div className="flex items-center">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold transition-colors duration-200 ${circleClasses}`}
        >
          {step}
        </span>
        <span 
          className={`ml-3 text-sm font-medium transition-colors duration-200 ${textClasses}`}
        >
          {name}
        </span>
      </div>
      {!isLast && (
        <div
          className={`ml-4 h-0.5 w-8 transition-colors duration-200 ${connectorClasses}`}
          aria-hidden="true"
        />
      )}
    </motion.button>
  );
};

const StepIndicator = ({ currentStep, onStepClick }) => {
  const { validateForm, setTouched, errors } = useFormikContext();

  const handleStepClick = useCallback(async (targetStep) => {
    if (targetStep < currentStep) {
      onStepClick(targetStep);
      return;
    }

    if (targetStep > currentStep) {
      const fieldsToValidate = Object.entries(stepFields)
        .filter(([step]) => Number(step) <= currentStep)
        .flatMap(([_, fields]) => fields);

      const touchedFields = fieldsToValidate.reduce((acc, field) => {
        if (field === 'routePlanner') {
          acc['routePlanner.name'] = true;
          acc['routePlanner.phone'] = true;
          acc['routePlanner.email'] = true;
        } else if (field === 'stops') {
          acc['stops.startingStop.location'] = true;
          acc['stops.startingStop.timeAM'] = true;
          acc['stops.startingStop.timePM'] = true;
          acc['stops.endingStop.location'] = true;
          acc['stops.endingStop.timeAM'] = true;
          acc['stops.endingStop.timePM'] = true;
        } else {
          acc[field] = true;
        }
        return acc;
      }, {});

      setTouched(touchedFields, true);

      const validationErrors = await validateForm();

      const hasErrors = fieldsToValidate.some(field => {
        if (field === 'routePlanner') {
          return validationErrors?.routePlanner?.name || 
                 validationErrors?.routePlanner?.phone || 
                 validationErrors?.routePlanner?.email;
        }
        if (field === 'stops') {
          return validationErrors?.stops?.startingStop || 
                 validationErrors?.stops?.endingStop;
        }
        return validationErrors[field];
      });

      if (hasErrors) {
        return; 
      }
    }

    onStepClick(targetStep);
  }, [currentStep, onStepClick, validateForm, setTouched]);

  return (
    <div className="mb-8 transition-colors duration-200">
      <div className="flex items-center justify-center">
        <nav 
          className="flex items-center space-x-4" 
          aria-label="Form Progress"
          role="navigation"
        >
          {STEPS.map(({ step, name }, index) => (
            <StepButton
              key={name}
              step={step}
              name={name}
              currentStep={currentStep}
              isLast={index === STEPS.length - 1}
              onClick={() => handleStepClick(step)}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

StepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired
};

StepButton.propTypes = {
  step: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  currentStep: PropTypes.number.isRequired,
  isLast: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default StepIndicator;