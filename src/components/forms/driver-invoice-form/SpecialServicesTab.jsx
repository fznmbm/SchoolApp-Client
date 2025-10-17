import React, { useContext, useCallback } from 'react';
import { 
  PlusCircleIcon, 
  MinusCircleIcon 
} from '@heroicons/react/24/outline';
import { ThemeContext } from '@/context/ThemeContext';
import { Button } from '@/components/common/Button';

const SpecialServicesTab = ({ data, updateData }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const updateSpecialServiceCharge = useCallback((serviceIndex, value) => {
    const updatedData = { ...data };
    
    if (!updatedData.services) {
      updatedData.services = [];
    }
    
    const service = updatedData.services[serviceIndex];
    
    if (service) {
      service.additionalCharge = parseFloat(value) || 0;
      updateData(updatedData);
    }
  }, [data, updateData]);
  
  const updateSpecialServiceDetails = useCallback((serviceIndex, field, value) => {
    const updatedData = { ...data };
    
    if (!updatedData.services) {
      updatedData.services = [];
    }
    
    const service = updatedData.services[serviceIndex];
    
    if (service) {
      service[field] = value;
      updateData(updatedData);
    }
  }, [data, updateData]);

  const addSpecialService = useCallback(() => {
    const updatedData = { ...data };
    
    if (!updatedData.services) {
      updatedData.services = [];
    }
    
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
    
    updatedData.services.push({
      date: dateString,
      day: dayOfWeek,
      routeName: 'New Service',
      routeNo: 'NEW',
      serviceType: 'OTHER',
      additionalCharge: 0,
      notes: '',
      isNew: true
    });
    
    updateData(updatedData);
  }, [data, updateData]);
  
  const removeSpecialService = useCallback((serviceIndex) => {
    const updatedData = { ...data };
    
    if (updatedData.services && updatedData.services.length > serviceIndex) {
      updatedData.services = updatedData.services.filter((_, index) => index !== serviceIndex);
      updateData(updatedData);
    }
  }, [data, updateData]);

  return (
    <div className="border rounded-lg overflow-hidden transition-colors duration-200 border-gray-200 dark:border-gray-700">
      <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 font-medium flex justify-between items-center transition-colors duration-200">
        <span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">Special Services</span>
        <Button
          variant="link"
          size="sm"
          onClick={addSpecialService}
          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          aria-label="Add special service"
        >
          <PlusCircleIcon className="h-4 w-4 mr-1" />
          Add Special Service
        </Button>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 transition-colors duration-200">
        {!data.services || data.services.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-3 transition-colors duration-200">No special services in the selected period</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
              <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Day</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Date</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Route Name</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Route No</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Service Type</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Notes</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Charge</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                {data.services.map((service, serviceIndex) => (
                  <tr 
                    key={`service-${serviceIndex}`} 
                    className={serviceIndex % 2 === 0 
                      ? 'bg-white dark:bg-gray-800' 
                      : 'bg-gray-50 dark:bg-gray-750'
                    }
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200">
                      <select
                        value={service.day || ''}
                        onChange={(e) => updateSpecialServiceDetails(serviceIndex, 'day', e.target.value)}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        aria-label="Day of week"
                      >
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      <input
                        type="date"
                        value={service.date || ''}
                        onChange={(e) => updateSpecialServiceDetails(serviceIndex, 'date', e.target.value)}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        aria-label="Service date"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      <input
                        type="text"
                        value={service.routeName || ''}
                        onChange={(e) => updateSpecialServiceDetails(serviceIndex, 'routeName', e.target.value)}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        aria-label="Route name"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      <input
                        type="text"
                        value={service.routeNo || ''}
                        onChange={(e) => updateSpecialServiceDetails(serviceIndex, 'routeNo', e.target.value)}
                        className="w-24 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        aria-label="Route number"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      <select
                        value={service.serviceType || 'OTHER'}
                        onChange={(e) => updateSpecialServiceDetails(serviceIndex, 'serviceType', e.target.value)}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        aria-label="Service type"
                      >
                        <option value="EARLY_PICKUP">Early Pickup</option>
                        <option value="LATE_PICKUP">Late Pickup</option>
                        <option value="EXTRA_PICKUP">Extra Pickup</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      <input
                        type="text"
                        value={service.notes || ''}
                        onChange={(e) => updateSpecialServiceDetails(serviceIndex, 'notes', e.target.value)}
                        className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                        placeholder="Add notes..."
                        aria-label="Service notes"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">£</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={service.additionalCharge || 0}
                          onChange={(e) => updateSpecialServiceCharge(serviceIndex, e.target.value)}
                          className="w-20 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                          aria-label="Service charge"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                      <button
                        onClick={() => removeSpecialService(serviceIndex)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                        title="Remove service"
                        aria-label="Remove service"
                      >
                        <MinusCircleIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Special Services Total</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200 transition-colors duration-200">£{data.totalPay.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialServicesTab;