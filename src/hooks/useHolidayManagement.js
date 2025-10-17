// useHolidayManagement.js
import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateSchoolHolidays } from '@/services/school';

export const useHolidayManagement = ({ id, school, queryClient }) => {
  const [holidayList, setHolidayList] = useState([]);
  const [isEditingHolidays, setIsEditingHolidays] = useState(false);
  
  // Reset holiday list based on school data
  const resetHolidayList = useCallback(() => {
    if (school?.holidays) {
      setHolidayList(school.holidays.map(holiday => ({
        ...holiday,
        startDate: holiday.startDate.substring(0, 10),
        endDate: holiday.endDate.substring(0, 10)
      })));
    } else {
      setHolidayList([]);
    }
  }, [school?.holidays]);

  // Mutation for updating holidays
  const { mutate: updateHolidays, isPending: isUpdatingHolidays } = useMutation({
    mutationFn: (holidays) => updateSchoolHolidays({ id, holidays }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school", id] });
      setIsEditingHolidays(false);
    },
    onError: (error) => {
      console.error('Error updating holidays:', error);
      alert(`Error updating holidays: ${error.message}`);
    }
  });

  // Start editing holidays
  const startEditingHolidays = useCallback(() => {
    resetHolidayList();
    setIsEditingHolidays(true);
  }, [resetHolidayList]);

  // Cancel editing holidays
  const cancelEditingHolidays = useCallback(() => {
    resetHolidayList();
    setIsEditingHolidays(false);
  }, [resetHolidayList]);

  // Add new holiday
  const handleAddHoliday = useCallback(() => {
    setHolidayList(prev => [
      ...prev,
      {
        isNew: true,
        startDate: new Date().toISOString().substring(0, 10),
        endDate: new Date().toISOString().substring(0, 10)
      }
    ]);
  }, []);

  // Remove holiday at specified index
  const handleRemoveHoliday = useCallback((indexToRemove) => {
    setHolidayList(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  // Update holiday field
  const handleHolidayChange = useCallback((index, field, value) => {
    setHolidayList(prev => {
      const updatedHolidays = [...prev];
      updatedHolidays[index] = {
        ...updatedHolidays[index],
        [field]: value
      };
      return updatedHolidays;
    });
  }, []);

  // Save holidays
  const handleSaveHolidays = useCallback(() => {
    // Validate dates
    const invalidDatePairs = holidayList.filter(holiday => {
      const startDate = new Date(holiday.startDate);
      const endDate = new Date(holiday.endDate);
      return startDate > endDate;
    });

    if (invalidDatePairs.length > 0) {
      alert('End date cannot be before start date for holidays');
      return;
    }

    // Convert date strings to ISO format and clean up data
    const formattedHolidays = holidayList.map(holiday => {
      const formattedHoliday = {
        startDate: new Date(holiday.startDate).toISOString(),
        endDate: new Date(holiday.endDate).toISOString()
      };
      
      // Only include _id for existing holidays (not newly added ones)
      if (holiday._id && !holiday.isNew) {
        formattedHoliday._id = holiday._id;
      }
      
      return formattedHoliday;
    });

    updateHolidays(formattedHolidays);
  }, [holidayList, updateHolidays]);

  return {
    holidayList,
    isEditingHolidays,
    isUpdatingHolidays,
    startEditingHolidays,
    cancelEditingHolidays,
    handleAddHoliday,
    handleRemoveHoliday,
    handleHolidayChange,
    handleSaveHolidays
  };
};