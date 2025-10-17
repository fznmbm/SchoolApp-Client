import React, { useContext, useCallback } from 'react';
import { 
  PlusCircleIcon, 
  MinusCircleIcon 
} from '@heroicons/react/24/outline';
import { ThemeContext } from '@/context/ThemeContext';
import { Button } from '@/components/common/Button';

const RegularAssignmentsTab = ({ data, updateData }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  const updateRegularFare = useCallback((weekIndex, dayIndex, routeKey, value) => {
    const updatedData = { ...data };
    const route = updatedData.weeks[weekIndex].days[dayIndex][routeKey];
    
    if (route) {
      route.fare = parseFloat(value) || 0;
      updateData(updatedData);
    }
  }, [data, updateData]);
  
  const updateRegularRouteDetails = useCallback((weekIndex, dayIndex, routeKey, field, value) => {
    const updatedData = { ...data };
    const route = updatedData.weeks[weekIndex].days[dayIndex][routeKey];
    
    if (route) {
      route[field] = value;
      updateData(updatedData);
    }
  }, [data, updateData]);
  
  const addRegularAssignment = useCallback((weekIndex, dayIndex) => {
    const updatedData = { ...data };
    const day = updatedData.weeks[weekIndex].days[dayIndex];
    
    if (!day.route1) {
      day.route1 = {
        routeName: 'New Route',
        routeNo: 'NEW',
        fare: 0,
        isNew: true
      };
    } 
    else if (!day.route2) {
      day.route2 = {
        routeName: 'New Route',
        routeNo: 'NEW',
        fare: 0,
        isNew: true
      };
    }
    else {
      if (!day.extraRoutes) {
        day.extraRoutes = [];
      }
      
      day.extraRoutes.push({
        routeName: 'New Route',
        routeNo: 'NEW',
        fare: 0,
        isNew: true
      });
    }
    
    updateData(updatedData);
  }, [data, updateData]);
  
  const removeRegularAssignment = useCallback((weekIndex, dayIndex, routeKey, extraIndex = null) => {
    const updatedData = { ...data };
    const day = updatedData.weeks[weekIndex].days[dayIndex];
    
    if (routeKey === 'route1' || routeKey === 'route2') {
      day[routeKey] = null;
      
      if (routeKey === 'route1' && day.route2) {
        day.route1 = day.route2;
        day.route2 = null;
      }
    } else if (routeKey === 'extraRoutes' && extraIndex !== null) {
      day.extraRoutes = day.extraRoutes.filter((_, index) => index !== extraIndex);
    }
    
    updateData(updatedData);
  }, [data, updateData]);

  return (
    <div className="border rounded-lg overflow-hidden transition-colors duration-200 border-gray-200 dark:border-gray-700">
      <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700 font-medium flex justify-between transition-colors duration-200">
        <span className="text-gray-800 dark:text-gray-200 transition-colors duration-200">Regular Assignments</span>
        <div className="text-right text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
          Edit routes and click on day rows to add new routes
        </div>
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 transition-colors duration-200">
        {data.weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="mb-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">Week {week.weekNumber}</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-200">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Day</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Date</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Route Name</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Route No</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Fare</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
                  {week.days.map((day, dayIndex) => (
                    <React.Fragment key={`day-${dayIndex}`}>
                      {/* Route 1 */}
                      {day.route1 ? (
                        <tr className="bg-white dark:bg-gray-800 transition-colors duration-200">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 transition-colors duration-200" rowSpan={
                            (day.route1 ? 1 : 0) + 
                            (day.route2 ? 1 : 0) + 
                            (day.extraRoutes?.length || 0) + 
                            1 
                          }>
                            {day.day}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200" rowSpan={
                            (day.route1 ? 1 : 0) + 
                            (day.route2 ? 1 : 0) + 
                            (day.extraRoutes?.length || 0) + 
                            1 
                          }>
                            {day.date}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            <input
                              type="text"
                              value={day.route1.routeName || ''}
                              onChange={(e) => updateRegularRouteDetails(weekIndex, dayIndex, 'route1', 'routeName', e.target.value)}
                              className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                              aria-label={`Route 1 name for ${day.day}`}
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            <input
                              type="text"
                              value={day.route1.routeNo || ''}
                              onChange={(e) => updateRegularRouteDetails(weekIndex, dayIndex, 'route1', 'routeNo', e.target.value)}
                              className="w-24 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                              aria-label={`Route 1 number for ${day.day}`}
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            <div className="flex items-center">
                              <span className="mr-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">£</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={day.route1.fare || 0}
                                onChange={(e) => updateRegularFare(weekIndex, dayIndex, 'route1', e.target.value)}
                                className="w-20 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                                aria-label={`Route 1 fare for ${day.day}`}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                            <button
                              onClick={() => removeRegularAssignment(weekIndex, dayIndex, 'route1')}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                              title={`Remove route 1 for ${day.day}`}
                              aria-label={`Remove route 1 for ${day.day}`}
                            >
                              <MinusCircleIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ) : null}
                      
                      {/* Route 2 */}
                      {day.route2 ? (
                        <tr className="bg-gray-50 dark:bg-gray-750 transition-colors duration-200">
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            <input
                              type="text"
                              value={day.route2.routeName || ''}
                              onChange={(e) => updateRegularRouteDetails(weekIndex, dayIndex, 'route2', 'routeName', e.target.value)}
                              className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                              aria-label={`Route 2 name for ${day.day}`}
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            <input
                              type="text"
                              value={day.route2.routeNo || ''}
                              onChange={(e) => updateRegularRouteDetails(weekIndex, dayIndex, 'route2', 'routeNo', e.target.value)}
                              className="w-24 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                              aria-label={`Route 2 number for ${day.day}`}
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            <div className="flex items-center">
                              <span className="mr-2 text-gray-700 dark:text-gray-300 transition-colors duration-200">£</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={day.route2.fare || 0}
                                onChange={(e) => updateRegularFare(weekIndex, dayIndex, 'route2', e.target.value)}
                                className="w-20 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                                aria-label={`Route 2 fare for ${day.day}`}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                            <button
                              onClick={() => removeRegularAssignment(weekIndex, dayIndex, 'route2')}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                              title={`Remove route 2 for ${day.day}`}
                              aria-label={`Remove route 2 for ${day.day}`}
                            >
                              <MinusCircleIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ) : null}
                      
                      {/* Extra Routes */}
                      {day.extraRoutes && day.extraRoutes.length > 0 && 
                        day.extraRoutes.map((route, extraIndex) => (
                          <tr 
                            key={`extra-${extraIndex}`} 
                            className={extraIndex % 2 === 0 
                              ? 'bg-white dark:bg-gray-800' 
                              : 'bg-gray-50 dark:bg-gray-750'
                            }
                          >
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                              <input
                                type="text"
                                value={route.routeName || ''}
                                onChange={(e) => {
                                  const updatedData = { ...data };
                                  updatedData.weeks[weekIndex].days[dayIndex].extraRoutes[extraIndex].routeName = e.target.value;
                                  updateData(updatedData);
                                }}
                                className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                                aria-label={`Extra route ${extraIndex + 1} name for ${day.day}`}
                              />
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                              <input
                                type="text"
                                value={route.routeNo || ''}
                                onChange={(e) => {
                                  const updatedData = { ...data };
                                  updatedData.weeks[weekIndex].days[dayIndex].extraRoutes[extraIndex].routeNo = e.target.value;
                                  updateData(updatedData);
                                }}
                                className="w-24 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                                aria-label={`Extra route ${extraIndex + 1} number for ${day.day}`}
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
                                  onChange={(e) => {
                                    const updatedData = { ...data };
                                    updatedData.weeks[weekIndex].days[dayIndex].extraRoutes[extraIndex].fare = parseFloat(e.target.value) || 0;
                                    updateData(updatedData);
                                  }}
                                  className="w-20 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-right bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                                  aria-label={`Extra route ${extraIndex + 1} fare for ${day.day}`}
                                />
                              </div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                              <button
                                onClick={() => removeRegularAssignment(weekIndex, dayIndex, 'extraRoutes', extraIndex)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                                title={`Remove extra route ${extraIndex + 1} for ${day.day}`}
                                aria-label={`Remove extra route ${extraIndex + 1} for ${day.day}`}
                              >
                                <MinusCircleIcon className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                      
                      {/* Add Route Button */}
                      <tr className="bg-blue-50 dark:bg-blue-900 transition-colors duration-200">
                        <td colSpan={6} className="px-3 py-2 text-center">
                          <button
                            onClick={() => addRegularAssignment(weekIndex, dayIndex)}
                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            aria-label={`Add route for ${day.date}`}
                          >
                            <PlusCircleIcon className="h-4 w-4 mr-1" />
                            Add route for {day.date}
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        
        <div className="flex justify-end">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-colors duration-200">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Regular Assignments Total</div>
            <div className="text-lg font-bold text-gray-800 dark:text-gray-200 transition-colors duration-200">£{data.totalPay.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegularAssignmentsTab;