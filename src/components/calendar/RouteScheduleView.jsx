import React, { useContext } from 'react';
import { ThemeContext } from '@context/ThemeContext';
import { formatDateString } from '@utils/calendarUtils';
import { useRouteSchedule } from '@hooks/useRouteSchedule';
import CalendarHeader from './CalendarHeader';
import DayCell from './DayCell';
import DayDetailModal from './DayDetailModal';
import EventFilters from './EventFilters';

/**
 * Main Route Schedule View component
 */
const RouteScheduleView = () => {
  const { isDarkMode } = useContext(ThemeContext);
  
  const {
    month,
    year,
    selectedDay,
    setSelectedDay,
    eventTypeFilters,
    handleFilterChange,
    nextMonth,
    prevMonth,
    goToToday,
    getFilteredEvents,
    handleDayCellClick,
    dates,
    routeEvents,
    availableRoutes,
    isLoading,
    error
  } = useRouteSchedule();
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md transition-colors duration-200">
        Error loading calendar data: {error.message || 'Unknown error'}
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 
                    transition-colors duration-200"
          role="region"
          aria-label="Route schedule calendar">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <CalendarHeader 
          month={month}
          year={year}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onToday={goToToday}
        />
        
        {/* Event type filters */}
        <EventFilters 
          filters={eventTypeFilters} 
          onFilterChange={handleFilterChange} 
        />
      </div>
      
      {/* Table View */}
      <div className={`overflow-x-auto ${isLoading ? 'opacity-60' : ''}`}>
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
              <th className="py-2 px-3 border border-gray-200 dark:border-gray-700 
                           text-left font-medium text-gray-500 dark:text-gray-400 
                           w-32 transition-colors duration-200">
                Date
              </th>
              {Array.isArray(availableRoutes) && availableRoutes.map(route => (
                <th key={route} 
                    className="py-2 px-3 border border-gray-200 dark:border-gray-700 
                             text-left font-medium text-gray-500 dark:text-gray-400
                             transition-colors duration-200">
                  Route {route}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(dates) && dates.map(date => {
              const dateStr = formatDateString(date);
              const isToday = date.toDateString() === new Date().toDateString();
              const dateFormatter = new Intl.DateTimeFormat('en-US', { 
                day: 'numeric', 
                month: 'short', 
                weekday: 'short'
              });
              
              return (
                <tr key={dateStr} 
                    className={`${isToday ? 
                      'bg-yellow-50 dark:bg-yellow-900/20' : 
                      'dark:bg-gray-900'} transition-colors duration-200`}>
                  <td className={`py-1 px-3 border border-gray-200 dark:border-gray-700 
                                ${isToday ? 'font-bold' : ''} 
                                text-gray-800 dark:text-gray-100
                                transition-colors duration-200`}>
                    {dateFormatter.format(date)}
                  </td>
                  
                  {Array.isArray(availableRoutes) && availableRoutes.map(route => {
                    if (!routeEvents[route]) return null;
                    
                    const events = routeEvents[route][dateStr] || [];
                    
                    return (
                      <DayCell
                        key={`${route}-${dateStr}`}
                        route={route}
                        dateStr={dateStr}
                        events={events}
                        isToday={isToday}
                        getFilteredEvents={getFilteredEvents}
                        onDayCellClick={handleDayCellClick}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Day detail modal */}
      {selectedDay && (
        <DayDetailModal 
          day={selectedDay} 
          onClose={() => setSelectedDay(null)} 
        />
      )}
    </div>
  );
};

export default RouteScheduleView;