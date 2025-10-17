import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  AcademicCapIcon,
  TruckIcon,
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const EventIndicator = ({ count, type }) => {
  let bgColor = 'bg-gray-200';
  let Icon = null;
  
  switch (type) {
    case 'holiday':
      bgColor = 'bg-blue-100 text-blue-600';
      Icon = AcademicCapIcon;
      break;
    case 'tempDriver':
      bgColor = 'bg-yellow-100 text-yellow-600';
      Icon = TruckIcon;
      break;
    case 'specialService':
      bgColor = 'bg-purple-100 text-purple-600';
      Icon = ClockIcon;
      break;
    case 'absence':
      bgColor = 'bg-red-100 text-red-600';
      Icon = ExclamationCircleIcon;
      break;
    default:
      bgColor = 'bg-gray-200 text-gray-600';
  }
  
  return count > 0 ? (
    <div className={`flex items-center justify-center rounded-full ${bgColor} h-5 w-5 text-xs`}>
      {Icon ? <Icon className="h-3 w-3" /> : count}
    </div>
  ) : null;
};

const EventDetails = ({ events }) => {
  if (!events) return null;
  
  const { holidays, tempDrivers, specialServices, absences } = events;
  
  return (
    <div className="absolute z-10 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-2 text-xs">
      {holidays.length > 0 && (
        <div className="mb-2">
          <h4 className="font-semibold text-blue-600 flex items-center">
            <AcademicCapIcon className="h-3 w-3 mr-1" /> School Holidays
          </h4>
          <ul className="pl-4 mt-1">
            {holidays.map((holiday, idx) => (
              <li key={`h-${idx}`}>{holiday.schoolName}</li>
            ))}
          </ul>
        </div>
      )}
      
      {tempDrivers.length > 0 && (
        <div className="mb-2">
          <h4 className="font-semibold text-yellow-600 flex items-center">
            <TruckIcon className="h-3 w-3 mr-1" /> Temporary Drivers
          </h4>
          <ul className="pl-4 mt-1">
            {tempDrivers.map((driver, idx) => (
              <li key={`d-${idx}`}>
                {driver.driverName} ({driver.routeNo}) - {driver.timeOfDay}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {specialServices.length > 0 && (
        <div className="mb-2">
          <h4 className="font-semibold text-purple-600 flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" /> Special Services
          </h4>
          <ul className="pl-4 mt-1">
            {specialServices.map((service, idx) => (
              <li key={`s-${idx}`}>
                {service.studentName} - {service.serviceType}
                {service.specialTime && ` (${service.specialTime})`}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {absences.length > 0 && (
        <div className="mb-2">
          <h4 className="font-semibold text-red-600 flex items-center">
            <ExclamationCircleIcon className="h-3 w-3 mr-1" /> Absences
          </h4>
          <ul className="pl-4 mt-1">
            {absences.map((absence, idx) => (
              <li key={`a-${idx}`}>
                {absence.studentName} - 
                {absence.morningAbsent && absence.eveningAbsent 
                  ? ' All day' 
                  : absence.morningAbsent 
                    ? ' Morning' 
                    : ' Evening'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const CalendarDay = ({ dayData }) => {
  const [showDetails, setShowDetails] = React.useState(false);
  
  if (!dayData.isCurrentMonth) {
    return <div className="border border-gray-100 h-32 bg-gray-50"></div>;
  }
  
  const { day, date, isToday, events } = dayData;
  
  const hasEvents = events && (
    events.holidays.length > 0 || 
    events.tempDrivers.length > 0 || 
    events.specialServices.length > 0 || 
    events.absences.length > 0
  );
  
  return (
    <div 
      className={`border border-gray-100 h-32 relative ${
        isToday ? 'bg-yellow-50' : ''
      }`}
      onMouseEnter={() => hasEvents && setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <div className={`px-2 py-1 ${isToday ? 'font-bold' : ''}`}>
        {day}
      </div>
      
      {hasEvents && (
        <div className="px-2">
          <div className="flex space-x-1 flex-wrap">
            <EventIndicator count={events.holidays.length} type="holiday" />
            <EventIndicator count={events.tempDrivers.length} type="tempDriver" />
            <EventIndicator count={events.specialServices.length} type="specialService" />
            <EventIndicator count={events.absences.length} type="absence" />
          </div>
          
          {showDetails && <EventDetails events={events} />}
        </div>
      )}
    </div>
  );
};

export default CalendarDay;