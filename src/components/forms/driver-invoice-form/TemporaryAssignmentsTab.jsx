import React, { useContext, useCallback } from 'react';
import { format } from 'date-fns';
import { 
  PlusCircleIcon, 
  MinusCircleIcon 
} from '@heroicons/react/24/outline';
import { ThemeContext } from '@/context/ThemeContext';
import { Button } from '@/components/common/Button';

const TemporaryAssignmentsTab = ({ data, updateData }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const updateTemporaryFare = useCallback((dayIndex, routeIndex, value) => {
    const updatedData = { ...data };
    const route = updatedData.days[dayIndex].routes[routeIndex];
    
    if (route) {
      route.fare = parseFloat(value) || 0;
      updateData(updatedData);
    }
  }, [data, updateData]);
  
  const updateTemporaryRouteDetails = useCallback((dayIndex, routeIndex, field, value) => {
    const updatedData = { ...data };
    const route = updatedData.days[dayIndex].routes[routeIndex];
    
    if (route) {
      route[field] = value;
      updateData(updatedData);
    }
  }, [data, updateData]);
  
  const addNewTemporaryDay = useCallback(() => {
    const updatedData = { ...data };
    
    const today = new Date();
    const dateString = format(today, 'yyyy-MM-dd');
    const dayOfWeek = format(today, 'EEEE');
    
    const dateExists = updatedData.days.some(day => day.date === dateString);
    
    if (!dateExists) {
      updatedData.days.push({
        day: dayOfWeek,
        date: dateString,
        routes: [{
          routeName: 'New Route',
          routeNo: 'NEW',
          fare: 0,
          isNew: true
        }]
      });
      
      updatedData.days.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      updateData(updatedData);
    }
  }, [data, updateData]);

  const addTemporaryAssignment = useCallback((dayIndex) => {
    const updatedData = { ...data };
    const day = updatedData.days[dayIndex];
    
    if (day) {
      day.routes.push({
        routeName: 'New Route',
        routeNo: 'NEW',
        fare: 0,
        isNew: true
      });
      
      updateData(updatedData);
    }
  }, [data, updateData]);

  const removeTemporaryAssignment = useCallback((dayIndex, routeIndex) => {
    const updatedData = { ...data };
    const day = updatedData.days[dayIndex];
    
    if (day) {
      day.routes = day.routes.filter((_, index) => index !== routeIndex);
      
      // If no routes left, remove the day
      if (day.routes.length === 0) {
        updatedData.days = updatedData.days.filter((_, index) => index !== dayIndex);
      }
      
      updateData(updatedData);
    }
  }, [data, updateData]);

  return (
    <div className="border rounded-lg overflow-hidden transition-colors duration-200 border-gray-200 dark:border-gray-700">
      <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b font-medium flex justify-between items-center border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">Temporary Assignments</span>
        <Button
          variant="link"
          size="sm"
          onClick={addNewTemporaryDay}
          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          aria-label="Add new temporary assignment"
        >
          <PlusCircleIcon className="h-4 w-4 mr-1" />
          Add New Temporary Assignment
        </Button>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 transition-colors duration-200">
        {data.days.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 italic text-center py-3 transition-colors duration-200">No temporary assignments in the selected period</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
              <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Day (Time)</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Date</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Route Name</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Route No</th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Fare</th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                {data.days.map((day, dayIndex) => (
                  <React.Fragment key={`temp-day-${dayIndex}`}>
                    {day.routes.map((route, routeIndex) => (
                      <tr 
                        key={`temp-route-${dayIndex}-${routeIndex}`} 
                        className={routeIndex % 2 === 0 
                          ? 'bg-white dark:bg-gray-800' 
                          : 'bg-gray-50 dark:bg-gray-750'
                        }
                      >
                        {routeIndex === 0 && (
                          <>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200" rowSpan={day.routes.length + 1}>
                              {day.routes.map(route => route.day || day.day).join(', ')}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200" rowSpan={day.routes.length + 1}>{day.date}</td>
                          </>
                        )}
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                          <input
                            type="text"
                            value={route.routeName || ''}
                            onChange={(e) => updateTemporaryRouteDetails(dayIndex, routeIndex, 'routeName', e.target.value)}
                            className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                            aria-label={`Route name for ${day.day}`}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                          <input
                            type="text"
                            value={route.routeNo || ''}
                            onChange={(e) => updateTemporaryRouteDetails(dayIndex, routeIndex, 'routeNo', e.target.value)}
                            className="w-24 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                            aria-label={`Route number for ${day.day}`}
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">£</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={route.fare || 0}
                              onChange={(e) => updateTemporaryFare(dayIndex, routeIndex, e.target.value)}
                              className="w-20 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                              aria-label={`Route fare for ${day.day}`}
                            />
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => removeTemporaryAssignment(dayIndex, routeIndex)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                            title={`Remove route for ${day.day}`}
                            aria-label={`Remove route for ${day.day}`}
                          >
                            <MinusCircleIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-blue-50 dark:bg-blue-900 transition-colors duration-200">
                      <td colSpan={4} className="px-3 py-2 text-center">
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => addTemporaryAssignment(dayIndex)}
                          className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          aria-label={`Add assignment for ${day.date}`}
                        >
                          <PlusCircleIcon className="h-4 w-4 mr-1" />
                          Add assignment for {day.date}
                        </Button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Temporary Assignments Total</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200 transition-colors duration-200">£{data.totalPay.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemporaryAssignmentsTab;