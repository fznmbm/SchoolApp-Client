import React from 'react';
import Event from './Event';


const DayCell = ({ route, dateStr, events, isToday, getFilteredEvents, onDayCellClick }) => {
  if (!route) return null;
  
  const filteredEvents = getFilteredEvents(events || []);
  
  const eventsByType = {
    holiday: filteredEvents.filter(e => e.type === 'holiday'),
    tempDriver: filteredEvents.filter(e => e.type === 'tempDriver'),
    specialService: filteredEvents.filter(e => e.type === 'specialService'),
    absence: filteredEvents.filter(e => e.type === 'absence')
  };
  
  const hasAnyEvents = filteredEvents.length > 0;
  
  // Number of events to display initially
  const maxDisplayEvents = 3;
  const hasMoreEvents = filteredEvents.length > maxDisplayEvents;
  const displayEvents = filteredEvents.slice(0, maxDisplayEvents);
  
  // Combine all events for the day detail modal
  const allEvents = [];
  Object.values(eventsByType).forEach(events => allEvents.push(...events));
  
  return (
    <td 
      key={`${route}-${dateStr}`} 
      className={`py-1 px-2 border border-gray-200 dark:border-gray-700 align-top 
        transition-colors duration-200 cursor-pointer
        ${isToday ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'dark:bg-gray-800'}
        hover:bg-gray-50 dark:hover:bg-gray-700`}
      onClick={() => onDayCellClick({
        date: new Date(dateStr),
        events: allEvents,
        route: route
      })}
      role="button"
      aria-label={`View events for route ${route} on ${dateStr}`}
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onDayCellClick({
            date: new Date(dateStr),
            events: allEvents,
            route: route
          });
        }
      }}
    >
      <div className="max-h-32 overflow-y-auto">
        {hasAnyEvents ? (
          <div className="space-y-1">
            {displayEvents.map((event, idx) => (
              <Event key={idx} event={event} />
            ))}
            
            {hasMoreEvents && (
              <div className="text-gray-500 dark:text-gray-400 text-xs italic px-1 transition-colors duration-200">
                +{filteredEvents.length - maxDisplayEvents} more
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 dark:text-gray-500 italic text-xs transition-colors duration-200">
            No events
          </div>
        )}
      </div>
    </td>
  );
};

export default DayCell;