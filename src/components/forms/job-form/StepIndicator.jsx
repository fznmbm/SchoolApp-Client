import React from 'react';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <nav className="mt-4" aria-label="Form progress">
      <ol className="flex items-center">
        {steps.map((stepLabel, index) => (
          <React.Fragment key={index}>
            {/* Step circle with number */}
            <li className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full 
                  ${currentStep > index 
                    ? "bg-blue-600 dark:bg-blue-500" 
                    : "bg-gray-300 dark:bg-gray-600"} 
                  text-white transition-colors duration-300`}
                aria-current={currentStep === index + 1 ? "step" : undefined}
              >
                <span className="sr-only">Step {index + 1}</span>
                {index + 1}
              </div>
              <span
                className={`ml-2 text-sm font-medium 
                  ${currentStep > index 
                    ? "text-blue-600 dark:text-blue-400" 
                    : "text-gray-500 dark:text-gray-400"}
                  transition-colors duration-300`}
              >
                {stepLabel}
              </span>
            </li>
            
            {/* Connector line (skip after last step) */}
            {index < steps.length - 1 && (
              <li className="flex-1 h-0.5 mx-2 bg-gray-200 dark:bg-gray-600 transition-colors duration-300" aria-hidden="true"></li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;