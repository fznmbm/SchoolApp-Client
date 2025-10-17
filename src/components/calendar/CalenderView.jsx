import React, { useState, useContext, useCallback } from 'react';
import { useCalendar } from '@/hooks/useCalendar';
import { ThemeContext } from '@context/ThemeContext';
import CalendarHeader from './CalendarHeader';
import Event from './Event';
import EventFilters from './EventFilters';
import DayDetailModal from './DayDetailModal';
import { weekDays } from './calendarConstants';

const Calendar = ({ events = [], fetchEvents }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  const {
    currentDate,
    month,
    year,
    calendarDays,
    nextMonth,
    prevMonth,
    goToToday,
    isLoading,
    error,
    routes,
    selectedRoute,
    setSelectedRoute
  } = useCalendar();
  
  const [selectedDay, setSelectedDay] = useState(null);
  const [eventTypeFilters, setEventTypeFilters] = useState({
    holiday: true,
    tempDriver: true,
    specialService: true,
    absence: true
  });
  
  const handleFilterChange = useCallback((eventType) => {
    setEventTypeFilters(prev => ({
      ...prev,
      [eventType]: !prev[eventType]
    }));
  }, []);
  
  const filterEvents = useCallback((events) => {
    if (!events) return [];
    return events.filter(event => event.type && eventTypeFilters[event.type]);
  }, [eventTypeFilters]);
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md transition-colors duration-200">
        Error loading calendar data: {error.message || 'Unknown error'}
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 overflow-hidden transition-colors duration-200">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <CalendarHeader 
          month={month}
          year={year}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onToday={goToToday}
        />
        
        {/* Route filter */}
        {routes && routes.length > 0 && (
          <div className="mb-2">
            <label htmlFor="route-filter" className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">Route:</label>
            <select
              id="route-filter"
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded px-2 py-1 text-sm transition-colors duration-200"
              aria-label="Select route"
            >
              {routes.map(route => (
                <option key={route} value={route}>{route}</option>
              ))}
            </select>
          </div>
        )}
        
        {/* Event type filters */}
        <EventFilters 
          filters={eventTypeFilters} 
          onFilterChange={handleFilterChange} 
        />
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg transition-colors duration-200">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          {weekDays.map((day, index) => (
            <div 
              key={day}
              className={`py-2 text-center text-sm font-medium transition-colors duration-200 ${
                index === 0 || index === 6 
                  ? 'text-red-400 dark:text-red-300' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className={`grid grid-cols-7 ${isLoading ? 'opacity-60' : ''}`}>
          {Array.isArray(calendarDays) && calendarDays.map((dayData, index) => {
            if (!dayData || !dayData.isCurrentMonth) {
              return (
                <div 
                  key={`empty-${month}-${year}-${index}`} 
                  className="border border-gray-100 dark:border-gray-700 min-h-36 bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
                />
              );
            }
            
            const { day, events = [], isToday } = dayData;
            const filteredEvents = filterEvents(events);
            const displayEvents = filteredEvents.slice(0, 5); 
            
            return (
              <div 
                key={`day-${month}-${year}-${index}`}
                className={`border border-gray-100 dark:border-gray-700 min-h-36 relative transition-colors duration-200 cursor-pointer ${
                  isToday 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setSelectedDay({...dayData, events: filteredEvents})}
                role="button"
                aria-label={`View details for ${day} ${month + 1}/${year}`}
                tabIndex="0"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedDay({...dayData, events: filteredEvents});
                  }
                }}
              >
                {/* Day number */}
                <div className={`px-2 py-1 text-right text-gray-800 dark:text-gray-200 transition-colors duration-200 ${isToday ? 'font-bold' : ''}`}>
                  {day}
                </div>
                
                {/* Events */}
                <div className="px-1 text-xs space-y-1">
                  {displayEvents.map((event, idx) => (
                    <Event key={idx} event={event} />
                  ))}
                  
                  {filteredEvents.length > 5 && (
                    <div className="text-gray-500 dark:text-gray-400 text-xs italic px-1 py-1 transition-colors duration-200">
                      +{filteredEvents.length - 5} more
                    </div>
                  )}
                  
                  {filteredEvents.length === 0 && (
                    <div className="text-gray-400 dark:text-gray-500 italic px-1 transition-colors duration-200">No events</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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

export default Calendar;