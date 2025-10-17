import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon, CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { ThemeContext } from '@context/ThemeContext';
import UserNumberForm from '@/components/forms/user-invoice-form/UserNumberForm';
import UserInvoiceForm from '@/components/forms/user-invoice-form/UserInvoiceForm';
import InvoicePreview from '@/components/forms/user-invoice-form/InvoicePreview';
import { submitDriverInvoice,submitPAInvoice } from '@/services/user-invoice';
import { getCompany } from '@services/company';

export const Card = ({ children, className = '', ...props }) => (
  <div
    className={clsx(
      'bg-surface dark:bg-surface-dark-secondary border border-border-light dark:border-border-dark-mode rounded-lg shadow-sm p-6 transition-colors duration-200',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Improved Steps Indicator Component
const StepsIndicator = ({ currentStep }) => {
  const steps = [
    {
      title: "User Verification",
      subtitle: "Verify your identity",
      shortTitle: "Verify"
    },
    {
      title: "Invoice Details",
      subtitle: "Enter billing information",
      shortTitle: "Details"
    },
    {
      title: "Review & Submit",
      subtitle: "Confirm your invoice",
      shortTitle: "Submit"
    }
  ];

  return (
    <div className="w-full py-4 mb-6">
      {/* Desktop Steps */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center relative z-10">
                {/* Circle with number or check */}
                <div
                  className={clsx(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted ? "bg-primary dark:bg-primary text-white" :
                      isActive ? "bg-primary/90 dark:bg-primary text-white ring-4 ring-primary/20 dark:ring-primary/20" :
                        "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Step title */}
                <div className="mt-2 text-center">
                  <p
                    className={clsx(
                      "font-medium transition-colors duration-300",
                      isActive || isCompleted ? "text-primary dark:text-primary-light" : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className={clsx(
                    "text-xs mt-1 transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-60",
                    "text-text-secondary dark:text-text-dark-secondary"
                  )}>
                    {step.subtitle}
                  </p>
                </div>
              </div>

              {/* Connecting line */}
              {!isLast && (
                <div className="w-full max-w-24 mx-4 relative">
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 mt-5"></div>
                  <div
                    className={clsx(
                      "absolute top-0 left-0 h-0.5 mt-5 transition-all duration-500 ease-in-out",
                      isCompleted ? "bg-primary dark:bg-primary" : "bg-gray-200 dark:bg-gray-700"
                    )}
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  ></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Steps */}
      <div className="flex sm:hidden items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted ? "bg-primary dark:bg-primary-light text-white" :
                    isActive ? "bg-primary/90 dark:bg-primary-light/90 text-white ring-2 ring-primary/20 dark:ring-primary-light/20" :
                      "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              {isActive && (
                <p className="text-xs mt-1 text-primary dark:text-primary-light font-medium">
                  {step.shortTitle}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const InvoiceWizard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const companyData = await getCompany();
        setCompany(companyData);
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to load company information');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const handleUserValidated = (data) => {
    setUserData(data);
    setCurrentStep(2);
    setError(null);
  };

  // Handle form data completion
  const handleFormCompleted = (data) => {
    setFormData(data);
    setCurrentStep(3);
    setError(null);
  };

  // Go back to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Edit form (go back to step 2)
  const handleEdit = () => {
    setCurrentStep(2);
    // We don't reset formData, so it will be used to initialize the form
  };

  // Handle final form submission
  const handleSubmit = async () => {
    if (!formData) return;
  
    try {
      setIsSubmitting(true);
      setError(null);
  
      // Use the correct submission function based on user type
      let response;
      if (userData.userType === 'DRIVER') {
        response = await submitDriverInvoice(formData);
      } else {
        response = await submitPAInvoice(formData);
      }
  
      // Show success message
      alert('Invoice submitted successfully!');
  
      // Reset the form and go back to step 1
      setCurrentStep(1);
      setUserData(null);
      setFormData(null);
  
    } catch (error) {
      console.error('Error submitting invoice:', error);
      setError(error.response?.data?.message || 'Error submitting invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-background dark:bg-background-dark transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          {userData?.userType === 'PA' ? 'PA' : 'Driver'} Invoice Submission
        </h1>
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-full bg-surface dark:bg-surface-dark hover:bg-surface-secondary dark:hover:bg-surface-dark-tertiary text-text-primary dark:text-text-dark-primary transition-colors duration-200"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Improved Steps Indicator */}
      <StepsIndicator currentStep={currentStep} />

      {/* Display error message if any */}
      {error && (
        <div className="mb-6 bg-error-light/20 dark:bg-error/20 text-error dark:text-error-light p-4 rounded-md">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Step Content */}
      {currentStep === 1 && (
        <UserNumberForm onSuccess={handleUserValidated} />
      )}

      {currentStep === 2 && userData && (
        <UserInvoiceForm
          companyName={company?.name || "Crown Cars Ltd"}
          userData={userData}
          initialFormData={formData}
          onSubmit={handleFormCompleted}
          onBack={handleBack}
        />
      )}

      {currentStep === 3 && formData && (
        <InvoicePreview
          companyName={company?.name || "Crown Cars Ltd"}
          formData={formData}
          onEdit={handleEdit}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default InvoiceWizard;