import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PlusCircleIcon, ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Input from '@components/common/input/Input';
import Button from '@components/common/Button';
import { Card } from '@pages/InvoiceWizard';

const UserInvoiceSchema = Yup.object().shape({
  userType: Yup.string().oneOf(['DRIVER', 'PA']).required('User type is required'),

  driverNumber: Yup.string().when('userType', {
    is: 'DRIVER',
    then: () => Yup.string().required('Driver number is required'),
    otherwise: () => Yup.string()
  }),
  paNumber: Yup.string().when('userType', {
    is: 'PA',
    then: () => Yup.string().required('PA number is required'),
    otherwise: () => Yup.string()
  }),

  name: Yup.string().required('Name is required'),
  mobile: Yup.string().required('Mobile number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  address: Yup.string().required('Address is required'),

  routeName1: Yup.string().required('Primary route name is required'),
  routeName2: Yup.string(),
  useSecondRoute: Yup.boolean(),
  weeks: Yup.array().of(
    Yup.object().shape({
      days: Yup.array().of(
        Yup.object().shape({
          day: Yup.string(),
          date: Yup.date().nullable(),
          routes: Yup.array().of(
            Yup.object().shape({
              fare: Yup.number().nullable().transform((value) => (isNaN(value) ? null : value))
            })
          )
        })
      )
    })
  ),
  extraJobs: Yup.array().of(
    Yup.object().shape({
      date: Yup.date().nullable(),
      description: Yup.string(),
      fare: Yup.number().nullable().transform((value) => (isNaN(value) ? null : value))
    })
  ),
  periodFrom: Yup.date().required('Start date is required'),
  periodTo: Yup.date().required('End date is required'),
  totalPay: Yup.number().positive('Total pay must be positive'),
  signature: Yup.string().required('Signature is required'),
  signatureDate: Yup.date().required('Signature date is required')
});


const DatePicker = ({ name, label, required, value, onChange, ...props }) => {
  const formatToUK = (isoDate) => {
    if (!isoDate) return '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;

    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatToISO = (ukDate) => {
    if (!ukDate) return '';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(ukDate)) return ukDate;

    const [day, month, year] = ukDate.split('/');
    return `${year}-${month}-${day}`;
  };

  const displayValue = formatToUK(value);

  const handleDateChange = (e) => {
    if (onChange) {
      const isoDate = e.target.value; 
      if (isoDate) {
        const [year, month, day] = isoDate.split('-');

        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            name,
            value: isoDate 
          }
        };

        onChange(syntheticEvent);
      }
    }
  };

  const handleTextChange = (e) => {
    const ukDate = e.target.value;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(ukDate)) {
      const isoDate = formatToISO(ukDate);

      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: isoDate
        }
      };

      if (onChange) onChange(syntheticEvent);
    } else {
      const emptyEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: '' 
        }
      };

      if (onChange) onChange(emptyEvent);
    }
  };

  const handleResetDate = () => {
    if (onChange) {
      const resetEvent = {
        target: {
          name,
          value: ''
        }
      };

      onChange(resetEvent);
    }
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1 transition-colors duration-200">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          id={`${name}-display`}
          className="block w-full pl-3 pr-16 py-2 border border-border-light dark:border-border-dark-mode rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-surface-dark-secondary dark:text-text-dark-primary transition-colors duration-200"
          placeholder="DD/MM/YYYY"
          value={displayValue}
          onChange={handleTextChange}
          required={required}
          {...props}
        />

        <input
          type="date"
          id={name}
          name={name}
          className="sr-only"
          value={value || ''}
          onChange={handleDateChange}
          required={required}
        />

        <div className="absolute inset-y-0 right-0 flex items-center">
          {value && (
            <button
              type="button"
              className="flex items-center p-1 mr-1 text-gray-500 hover:text-red-500 transition-colors"
              onClick={handleResetDate}
              title="Clear date"
              aria-label="Clear date"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            className="flex items-center px-2 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => {
              const dateInput = document.getElementById(name);
              if (dateInput) dateInput.showPicker();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const CurrencyField = ({ name, label, required, ...props }) => {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary dark:text-text-dark-secondary z-10 transition-colors duration-200">
        £
      </span>
      <Input
        name={name}
        label={label}
        type="number"
        step="0.01"
        required={required}
        className="pl-6"
        {...props}
      />
    </div>
  );
};

const getDayName = (dateString) => {
  if (!dateString) return '';

  let date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // Handle ISO date format (YYYY-MM-DD)
    const [year, month, day] = dateString.split('-');
    date = new Date(year, month - 1, day);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    // Handle UK date format (DD/MM/YYYY)
    const [day, month, year] = dateString.split('/');
    date = new Date(year, month - 1, day);
  } else {
    return '';
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return '';
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

const DriverInvoiceForm = ({ userData, initialFormData, onSubmit, onBack, companyName }) => {
  const [submitting, setSubmitting] = useState(false);
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const generateWeeks = () => {
    const weeks = [];
    for (let weekNum = 0; weekNum < 5; weekNum++) {
      const days = Array(5).fill(null).map(() => ({
        day: '',
        date: null,
        routes: [
          { fare: '' },
          { fare: '' }
        ]
      }));
      weeks.push({
        weekNumber: weekNum + 1,
        days
      });
    }
    return weeks;
  };

  const getInitialValues = () => {
    if (initialFormData) {
      if (initialFormData.weeks && initialFormData.weeks[0] &&
        (initialFormData.weeks[0].routeName1 || initialFormData.weeks[0].routeName2)) {
        const routeName1 = initialFormData.weeks[0].routeName1 || '';
        const routeName2 = initialFormData.weeks[0].routeName2 || '';
        const useSecondRoute = initialFormData.weeks[0].useSecondRoute || false;

        const updatedWeeks = initialFormData.weeks.map(week => {
          const { routeName1, routeName2, useSecondRoute, ...restOfWeek } = week;
          return restOfWeek;
        });

        return {
          ...initialFormData,
          routeName1,
          routeName2,
          useSecondRoute,
          weeks: updatedWeeks
        };
      }
      return initialFormData;
    }

    const commonValues = {
      userType: userData.userType || 'DRIVER',
      name: userData.name || '',
      mobile: userData.mobile || '',
      email: userData.email || '',
      address: userData.address || '',
      routeName1: '',
      routeName2: '',
      useSecondRoute: false,
      weeks: generateWeeks(),
      extraJobs: [{ date: null, description: '', fare: '' }],
      periodFrom: null,
      periodTo: null,
      totalPay: '0.00',
      signature: '',
      signatureDate: null
    };

    if (userData.userType === 'DRIVER') {
      return {
        ...commonValues,
        driverNumber: userData.driverNumber || '',
        paNumber: ''
      };
    } else {
      return {
        ...commonValues,
        paNumber: userData.paNumber || '',
        driverNumber: ''
      };
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      
      const formattedData = JSON.parse(JSON.stringify(values));
      
      let total = 0;
      
      formattedData.weeks.forEach(week => {
        week.days.forEach(day => {
          if (day.routes && day.routes.length > 0) {
            if (day.routes[0]) {
              day.routes[0].name = formattedData.routeName1 || '';
              if (day.routes[0].fare) {
                total += parseFloat(day.routes[0].fare) || 0;
              }
            }
            
            if (day.routes[1] && formattedData.useSecondRoute) {
              day.routes[1].name = formattedData.routeName2 || '';
              if (day.routes[1].fare) {
                total += parseFloat(day.routes[1].fare) || 0;
              }
            } else if (day.routes[1]) {
              day.routes.splice(1, 1);
            }
          }
        });
      });
      
      formattedData.extraJobs.forEach(job => {
        if (job.fare) {
          total += parseFloat(job.fare) || 0;
        }
      });
      
      formattedData.totalPay = parseFloat(total.toFixed(2));
      
      delete formattedData.routeName1;
      delete formattedData.routeName2;
      delete formattedData.useSecondRoute;
      
      onSubmit(formattedData);
    } catch (error) {
      console.error('Error processing form:', error);
      alert('Error processing form data');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateWeeklyTotal = (days) => {
    let weeklyTotal = 0;
    days.forEach(day => {
      day.routes.forEach(route => {
        if (route.fare) {
          weeklyTotal += parseFloat(route.fare) || 0;
        }
      });
    });
    return weeklyTotal.toFixed(2);
  };

  const calculateExtraJobsTotal = (jobs) => {
    let jobsTotal = 0;
    jobs.forEach(job => {
      if (job.fare) {
        jobsTotal += parseFloat(job.fare) || 0;
      }
    });
    return jobsTotal.toFixed(2);
  };

  const calculateGrandTotal = (values) => {
    let grandTotal = 0;

    values.weeks.forEach(week => {
      week.days.forEach(day => {
        day.routes.forEach(route => {
          if (route.fare) {
            grandTotal += parseFloat(route.fare) || 0;
          }
        });
      });
    });

    values.extraJobs.forEach(job => {
      if (job.fare) {
        grandTotal += parseFloat(job.fare) || 0;
      }
    });

    return grandTotal.toFixed(2);
  };

  const initialValues = getInitialValues();

  return (
    <div className="space-y-8">
      <Formik
        initialValues={initialValues}
        validationSchema={UserInvoiceSchema}
        onSubmit={handleSubmit}
        enableReinitialize={false}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => {
          useEffect(() => {
            const newTotalPay = calculateGrandTotal(values);
            setFieldValue('totalPay', newTotalPay);
          }, [values, setFieldValue]);

          return (
            <Form className="space-y-8">
              {/* Driver Information */}
              <Card>
                <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                  {values.userType === 'DRIVER' ? 'Driver Information' : 'Personal Assistant Information'}
                </h2>

                <input type="hidden" name="userType" value={values.userType} />

                {values.userType === 'DRIVER' ? (
                  <input type="hidden" name="driverNumber" value={values.driverNumber} />
                ) : (
                  <input type="hidden" name="paNumber" value={values.paNumber} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    label="Name"
                    placeholder="Enter your full name"
                    required
                  />
                  <Input
                    name="mobile"
                    label="Mobile"
                    placeholder="Enter your mobile number"
                    required
                  />
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    required
                  />
                  <div className="md:col-span-2">
                    <Input
                      name="address"
                      label="Address"
                      multiline
                      rows="3"
                      placeholder="Enter your full address"
                      required
                    />
                  </div>
                </div>
              </Card>

              {/* Route Information */}
              <Card>
                <h2 className="text-lg font-semibold mb-4 text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                  Route Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="routeName1"
                      label="Primary Route Name"
                      placeholder="Enter primary route name"
                      required
                    />
                  </div>

                  {values.useSecondRoute ? (
                    <div className="relative">
                      <Input
                        name="routeName2"
                        label="Secondary Route Name"
                        placeholder="Enter secondary route name"
                      />
                      <button
                        type="button"
                        className="absolute top-8 right-2 p-1.5 text-gray-700 hover:text-red-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200"
                        onClick={() => {
                          setFieldValue('useSecondRoute', false);
                          setFieldValue('routeName2', '');
                        }}
                        aria-label="Remove secondary route"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setFieldValue('useSecondRoute', true)}
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Second Route
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Weekly Routes */}
              {values.weeks.map((week, weekIndex) => (
                <Card key={weekIndex}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                      Week {week.weekNumber}
                    </h3>
                    <div className="text-right">
                      <span className="text-sm text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                        Weekly Total:
                      </span>
                      <span className="ml-2 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                        £{calculateWeeklyTotal(week.days)}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
                      <thead className="bg-surface-secondary dark:bg-surface-dark-tertiary transition-colors duration-200">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider w-24 transition-colors duration-200">
                            Day
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider w-32 transition-colors duration-200">
                            Date
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider w-28 transition-colors duration-200">
                            {values.routeName1 || "Primary Route"} Fare (£)
                          </th>
                          {values.useSecondRoute && (
                            <th className="px-3 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider w-28 transition-colors duration-200">
                              {values.routeName2 || "Secondary Route"} Fare (£)
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
                        {week.days.map((day, dayIndex) => (
                          <tr key={dayIndex}>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                                {values.weeks[weekIndex].days[dayIndex].date
                                  ? getDayName(values.weeks[weekIndex].days[dayIndex].date)
                                  : day.day || `Day ${dayIndex + 1}`}
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <DatePicker
                                name={`weeks[${weekIndex}].days[${dayIndex}].date`}
                                value={values.weeks[weekIndex].days[dayIndex].date || ''}
                                onChange={(e) => {
                                  const isoDate = e.target.value;
                                  setFieldValue(`weeks[${weekIndex}].days[${dayIndex}].date`, isoDate);
                                  if (isoDate) {
                                    const dayName = getDayName(isoDate);
                                    setFieldValue(`weeks[${weekIndex}].days[${dayIndex}].day`, dayName);
                                  }
                                }}
                              />
                            </td>

                            {/* Primary Route Fare */}
                            <td className="px-3 py-2 whitespace-nowrap">
                              <CurrencyField
                                name={`weeks[${weekIndex}].days[${dayIndex}].routes[0].fare`}
                              />
                            </td>

                            {/* Secondary Route Fare */}
                            {values.useSecondRoute && (
                              <td className="px-3 py-2 whitespace-nowrap">
                                <CurrencyField
                                  name={`weeks[${weekIndex}].days[${dayIndex}].routes[1].fare`}
                                />
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}

              {/* Extra Jobs */}
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    Extra Jobs (If you have done any covering jobs)
                  </h2>
                  <div className="text-right">
                    <span className="text-sm text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200">
                      Extra Jobs Total:
                    </span>
                    <span className="ml-2 font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                      £{calculateExtraJobsTotal(values.extraJobs)}
                    </span>
                  </div>
                </div>

                <FieldArray name="extraJobs">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.extraJobs.map((_, index) => (
                        <div key={index} className="flex flex-wrap gap-4 items-start">
                          <div className="w-full sm:w-32">
                            <DatePicker
                              name={`extraJobs[${index}].date`}
                              label="Date"
                              value={values.extraJobs[index].date || ''}
                              onChange={(e) => {
                                setFieldValue(`extraJobs[${index}].date`, e.target.value);
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Input
                              name={`extraJobs[${index}].description`}
                              label="Job Description"
                            />
                          </div>
                          <div className="w-full sm:w-32">
                            <CurrencyField
                              name={`extraJobs[${index}].fare`}
                              label="Fare (£)"
                            />
                          </div>
                          {index > 0 && (
                            <Button
                              variant="danger"
                              size="sm"
                              className="mt-6"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => push({ date: null, description: '', fare: '' })}
                      >
                        <PlusCircleIcon className="h-5 w-5 mr-1" />
                        Add Extra Job
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </Card>

              {/* Summary and Declaration */}
              <Card>
                <div className="mb-4">
                  <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    I confirm that the work I done for {companyName} is self employment work/job and confirm
                    that I am responsible to pay my own tax and N.I contribution.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <DatePicker
                      name="periodFrom"
                      label="Period of work From"
                      required
                      value={values.periodFrom || ''}
                      onChange={(e) => {
                        setFieldValue('periodFrom', e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <DatePicker
                      name="periodTo"
                      label="To"
                      required
                      value={values.periodTo || ''}
                      onChange={(e) => {
                        setFieldValue('periodTo', e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <CurrencyField
                    name="totalPay"
                    label="Total Pay (£)"
                    value={calculateGrandTotal(values)}
                    readOnly
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      name="signature"
                      label="Print Name / Signature"
                      required
                      placeholder="Enter your name as signature"
                    />
                  </div>
                  <div>
                    <DatePicker
                      name="signatureDate"
                      label="Date"
                      required
                      value={values.signatureDate || ''}
                      onChange={(e) => {
                        setFieldValue('signatureDate', e.target.value);
                      }}
                    />
                  </div>
                </div>
              </Card>

              {/* Navigation Buttons */}
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
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Review Invoice'}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default DriverInvoiceForm;