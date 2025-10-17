import React from 'react';
import { eventStyles } from './calendarConstants';

const Event = ({ event, isDetailed = false }) => {
  if (!event || !event.type) {
    return null;
  }
  
  // Get style for this event type
  const style = eventStyles[event.type] || eventStyles.holiday;
  
  return (
    <div className={`rounded transition-colors duration-200
      ${isDetailed ? 'py-3 px-4' : 'p-1 mb-1'} 
      ${style.bgColor} ${style.textColor} border ${style.borderColor}`}
    >
      <div className="flex items-center">
        {isDetailed ? (
          <div className={`w-4 h-4 rounded-full mr-3 bg-blue-500`}></div>
        ) : (
          <div className={`w-3 h-3 rounded-full mr-2 ${style.dotColor}`}></div>
        )}
        <span className={`${isDetailed ? 'text-base font-medium' : 'text-xs'} truncate`}>
          {event.label || 'Event'}
        </span>
      </div>
    </div>
  );
};

export default Event;