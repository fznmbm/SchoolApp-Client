import React, { useState, useContext } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, 
         startOfWeek, endOfWeek, addDays, isSameMonth, 
         isSameDay, isToday } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ThemeContext } from '@context/ThemeContext';

const DayHeader = ({ day }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="text-xs font-medium text-text-tertiary dark:text-text-dark-tertiary text-center py-2 transition-colors duration-200">
      {day}
    </div>
  );
};

const DayCell = ({ day, monthStart, selectedDate, onDateClick }) => {
  const { theme } = useContext(ThemeContext);
  
  const isCurrentMonth = isSameMonth(day, monthStart);
  const isSelected = isSameDay(day, selectedDate);
  const isDayToday = isToday(day);
  
  return (
    <div
      onClick={() => onDateClick(day)}
      className={`
        p-2 text-center text-sm cursor-pointer rounded transition-colors duration-200
        ${!isCurrentMonth 
          ? 'text-text-light dark:text-text-dark-tertiary' 
          : 'text-text-primary dark:text-text-dark-primary'}
        ${isSelected 
          ? 'bg-primary/20 text-primary dark:bg-primary-dark/30 dark:text-primary-light font-medium' 
          : 'hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary'}
        ${isDayToday && !isSelected 
          ? 'border border-primary dark:border-primary-light' 
          : ''}
      `}
      aria-selected={isSelected}
      tabIndex={isCurrentMonth ? 0 : -1}
      role="gridcell"
      aria-label={format(day, 'PPPP')}
    >
      {format(day, 'd')}
    </div>
  );
};

const DatePicker = ({ selectedDate, onChange, onClose, disabled = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  const handleDateClick = (day) => {
    if (!disabled) {
      onChange(day);
    }
  };
  
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4" role="heading" aria-level="2">
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={disabled}
          className={`
            p-1.5 rounded-full transition-colors duration-200
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary'} 
          `}
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="h-5 w-5 text-text-secondary dark:text-text-dark-secondary" />
        </button>
        <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          type="button"
          onClick={handleNextMonth}
          disabled={disabled}
          className={`
            p-1.5 rounded-full transition-colors duration-200
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary'} 
          `}
          aria-label="Next month"
        >
          <ChevronRightIcon className="h-5 w-5 text-text-secondary dark:text-text-dark-secondary" />
        </button>
      </div>
    );
  };
  
  const renderDays = () => {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return (
      <div className="grid grid-cols-7 mb-2" role="row">
        {days.map((day, i) => (
          <DayHeader key={i} day={day} />
        ))}
      </div>
    );
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    let rowIndex = 0;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <DayCell 
            key={day.toString()} 
            day={cloneDay} 
            monthStart={monthStart} 
            selectedDate={selectedDate} 
            onDateClick={handleDateClick} 
          />
        );
        day = addDays(day, 1);
      }
      
      rows.push(
        <div key={`row-${rowIndex}`} className="grid grid-cols-7" role="row">
          {days}
        </div>
      );
      
      rowIndex++;
      days = [];
    }
    
    return <div className="space-y-1" role="grid">{rows}</div>;
  };
  
  return (
    <div className={`
      shadow-lg border rounded-lg p-4 w-72 transition-colors duration-200
      bg-surface dark:bg-surface-dark 
      border-border-light dark:border-border-dark-mode
    `}
    role="dialog"
    aria-modal="true"
    aria-label="Date picker"
    >
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark-mode flex justify-between transition-colors duration-200">
        <button
          type="button"
          disabled={disabled}
          className={`
            text-sm font-medium transition-colors duration-200
            text-primary dark:text-primary-light 
            hover:text-primary-dark dark:hover:text-primary
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onClick={() => handleDateClick(new Date())}
        >
          Today
        </button>
        <button
          type="button"
          className={`
            text-sm font-medium transition-colors duration-200
            text-text-secondary dark:text-text-dark-secondary
            hover:text-text-primary dark:hover:text-text-dark-primary
          `}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DatePicker;