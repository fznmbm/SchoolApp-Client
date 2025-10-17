import React, { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { XMarkIcon, ArrowPathIcon, CheckIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const AdminInvoiceEditModal = ({ isOpen, invoice, onClose, onSave, isSaving }) => {
  const [editedInvoice, setEditedInvoice] = useState(invoice);

  useEffect(() => {
    setEditedInvoice(invoice);
  }, [invoice]);

  if (!isOpen || !editedInvoice) return null;

  const handleWeeklyRouteChange = (weekIndex, dayIndex, routeIndex, field, value) => {
    const newInvoice = { ...editedInvoice };
    newInvoice.weeks[weekIndex].days[dayIndex].routes[routeIndex][field] = value;
    
    // Recalculate total
    let total = 0;
    newInvoice.weeks.forEach(week => {
      week.days.forEach(day => {
        day.routes.forEach(route => {
          total += Number(route.fare) || 0;
        });
      });
    });
    newInvoice.extraJobs.forEach(job => {
      total += Number(job.fare) || 0;
    });
    newInvoice.totalPay = total;
    
    setEditedInvoice(newInvoice);
  };

  const handleExtraJobChange = (index, field, value) => {
    const newInvoice = { ...editedInvoice };
    newInvoice.extraJobs[index][field] = value;
    
    // Recalculate total
    let total = 0;
    newInvoice.weeks.forEach(week => {
      week.days.forEach(day => {
        day.routes.forEach(route => {
          total += Number(route.fare) || 0;
        });
      });
    });
    newInvoice.extraJobs.forEach(job => {
      total += Number(job.fare) || 0;
    });
    newInvoice.totalPay = total;
    
    setEditedInvoice(newInvoice);
  };

  const addExtraJob = () => {
    const newInvoice = { ...editedInvoice };
    newInvoice.extraJobs.push({
      date: new Date().toISOString(),
      description: '',
      fare: 0
    });
    setEditedInvoice(newInvoice);
  };

  const removeExtraJob = (index) => {
    const newInvoice = { ...editedInvoice };
    newInvoice.extraJobs.splice(index, 1);
    
    // Recalculate total
    let total = 0;
    newInvoice.weeks.forEach(week => {
      week.days.forEach(day => {
        day.routes.forEach(route => {
          total += Number(route.fare) || 0;
        });
      });
    });
    newInvoice.extraJobs.forEach(job => {
      total += Number(job.fare) || 0;
    });
    newInvoice.totalPay = total;
    
    setEditedInvoice(newInvoice);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 dark:bg-opacity-80">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Invoice
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </Button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Driver Info Section */}
            <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Driver Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Name: {editedInvoice.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Driver #: {editedInvoice.driverNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Period: {formatDate(editedInvoice.periodFrom)} - {formatDate(editedInvoice.periodTo)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Status: {editedInvoice.status}</p>
                </div>
              </div>
            </div>

            {/* Weekly Routes Section */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">Weekly Routes</h4>
              {editedInvoice.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="mb-6 border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3">
                    <h5 className="font-medium">Week {week.weekNumber}</h5>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Day</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fare (£)</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {week.days.map((day, dayIndex) => (
                          day.routes.map((route, routeIndex) => (
                            <tr key={`${weekIndex}-${dayIndex}-${routeIndex}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {routeIndex === 0 ? day.day : ''}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {routeIndex === 0 ? formatDate(day.date) : ''}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                                <input
                                  type="text"
                                  value={route.name || ''}
                                  onChange={(e) => handleWeeklyRouteChange(weekIndex, dayIndex, routeIndex, 'name', e.target.value)}
                                  className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none px-2 py-1 w-full"
                                />
                              </td>
                              <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-300">
                                <input
                                  type="number"
                                  value={route.fare || 0}
                                  onChange={(e) => handleWeeklyRouteChange(weekIndex, dayIndex, routeIndex, 'fare', Number(e.target.value))}
                                  className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none px-2 py-1 w-24 text-right"
                                  step="0.01"
                                />
                              </td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Extra Jobs Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium">Extra Jobs</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addExtraJob}
                  className="flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Job
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fare (£)</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {editedInvoice.extraJobs.map((job, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                          <input
                            type="date"
                            value={job.date ? new Date(job.date).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleExtraJobChange(index, 'date', e.target.value)}
                            className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                          <input
                            type="text"
                            value={job.description || ''}
                            onChange={(e) => handleExtraJobChange(index, 'description', e.target.value)}
                            className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none px-2 py-1 w-full"
                          />
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-300">
                          <input
                            type="number"
                            value={job.fare || 0}
                            onChange={(e) => handleExtraJobChange(index, 'fare', Number(e.target.value))}
                            className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none px-2 py-1 w-24 text-right"
                            step="0.01"
                          />
                        </td>
                        <td className="px-6 py-4 text-right text-sm">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeExtraJob(index)}
                            className="inline-flex items-center"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-300">
                        Total Pay:
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-gray-300">
                        £{editedInvoice.totalPay.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => onSave(editedInvoice)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoiceEditModal;