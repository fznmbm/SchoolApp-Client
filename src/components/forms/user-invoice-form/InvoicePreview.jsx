import React from 'react';
import { ArrowLeftIcon, CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Card } from '@pages/InvoiceWizard';
import Button from '@components/common/Button';

const InvoicePreview = ({ formData, onEdit, onBack, onSubmit, isSubmitting, companyName }) => {
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '£0.00';
    return `£${parseFloat(value).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const calculateWeeklyTotals = () => {
    const weeklyTotals = formData.weeks.map(week => {
      let total = 0;
      week.days.forEach(day => {
        day.routes.forEach(route => {
          if (route.fare) {
            total += parseFloat(route.fare) || 0;
          }
        });
      });
      return { weekNumber: week.weekNumber, total };
    });
    
    return weeklyTotals;
  };

  const calculateExtraJobsTotal = () => {
    let total = 0;
    formData.extraJobs.forEach(job => {
      if (job.fare) {
        total += parseFloat(job.fare) || 0;
      }
    });
    return total;
  };

  const weeklyTotals = calculateWeeklyTotals();
  const extraJobsTotal = calculateExtraJobsTotal();

  const isDriverType = formData.userType === 'DRIVER';

  return (
    <div className="space-y-8">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Review Your Invoice
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit Details
          </Button>
        </div>

        <p className="mb-6 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
          Please review your invoice details before final submission. Once submitted, you will not be able to make changes.
        </p>

        {/* User Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            {isDriverType ? 'Driver Information' : 'Personal Assistant Information'}
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                {isDriverType ? 'Driver Number' : 'PA Number'}
              </dt>
              <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {isDriverType ? formData.driverNumber : formData.paNumber}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                Name
              </dt>
              <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {formData.name}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                Mobile
              </dt>
              <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {formData.mobile}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                Email
              </dt>
              <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {formData.email}
              </dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                Address
              </dt>
              <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {formData.address}
              </dd>
            </div>
          </dl>
        </div>

        {/* Route Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Route Information
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                Primary Route
              </dt>
              <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {(() => {
                  // Extract route name from weekly data structure (check first week, all days)
                  let primaryRoute = formData.routeName1;
                  if (!primaryRoute && formData.weeks?.[0]?.days) {
                    for (const day of formData.weeks[0].days) {
                      if (day.routes?.[0]?.name) {
                        primaryRoute = day.routes[0].name;
                        break;
                      }
                    }
                  }
                  return primaryRoute || "Not specified";
                })()}
              </dd>
            </div>
            {(() => {
              // Check if secondary route exists in weekly data structure
              let secondaryRoute = formData.routeName2;
              if (!secondaryRoute && formData.weeks?.[0]?.days) {
                for (const day of formData.weeks[0].days) {
                  if (day.routes?.[1]?.name) {
                    secondaryRoute = day.routes[1].name;
                    break;
                  }
                }
              }
              const hasSecondRoute = !!secondaryRoute || formData.useSecondRoute;
              
              return hasSecondRoute && secondaryRoute ? (
                <div>
                  <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                    Secondary Route
                  </dt>
                  <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    {secondaryRoute || "Not specified"}
                  </dd>
                </div>
              ) : null;
            })()}
          </dl>
        </div>

        {/* Weekly Totals */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Weekly Earnings
          </h3>
          <div className="bg-surface-secondary dark:bg-surface-dark-tertiary rounded-md p-4 transition-colors duration-200">
            <ul className="divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
              {weeklyTotals.map((week) => (
                <li key={week.weekNumber} className="py-3 flex justify-between items-center">
                  <span className="text-sm text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    Week {week.weekNumber}
                  </span>
                  <span className="font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    {formatCurrency(week.total)}
                  </span>
                </li>
              ))}
              <li className="py-3 flex justify-between items-center">
                <span className="text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                  Extra Jobs
                </span>
                <span className="font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                  {formatCurrency(extraJobsTotal)}
                </span>
              </li>
              <li className="py-3 flex justify-between items-center">
                <span className="text-base font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                  Total Pay
                </span>
                <span className="text-lg font-bold text-primary dark:text-primary-light transition-colors duration-200">
                  {formatCurrency(formData.totalPay)}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Period and Declaration */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Period and Declaration
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                Period From
              </dt>
              <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {formatDate(formData.periodFrom)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                Period To
              </dt>
              <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {formatDate(formData.periodTo)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                Signature
              </dt>
              <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {formData.signature}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                Signature Date
              </dt>
              <dd className="mt-1 text-base text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {formatDate(formData.signatureDate)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 px-4 py-3 bg-surface-secondary dark:bg-surface-dark-tertiary rounded-md text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
            <p>
              I confirm that the work I done for {companyName} is self employment work/job and confirm 
              that I am responsible to pay my own tax and N.I contribution.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Submit Invoice
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InvoicePreview;