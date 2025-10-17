import React from 'react';
import PropTypes from 'prop-types';
import Button from '@components/common/Button';

const NavigationButtons = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isSubmitting,
  isPending,
  isEditMode = false
}) => {
  return (
    <div className="pt-5">
      <div className="flex justify-end">
        {currentStep > 1 && (
          <Button
            variant="outline"
            size="md"
            onClick={onPrevious}
            className="mr-3"
            aria-label="Go to previous step"
          >
            Previous
          </Button>
        )}
        
        {currentStep < totalSteps ? (
          <Button
            variant="primary"
            size="md"
            onClick={onNext}
            aria-label="Proceed to next step"
          >
            Next
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            onClick={onSubmit} 
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : isEditMode ? (
              "Update Route"
            ) : (
              "Create Route"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

NavigationButtons.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  isPending: PropTypes.bool,
  isEditMode: PropTypes.bool
};

export default NavigationButtons;