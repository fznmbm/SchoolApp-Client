import React, { useCallback, useMemo, useContext } from "react";
import { useFormikContext } from "formik";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { ThemeContext } from '@context/ThemeContext';
import PropTypes from 'prop-types';

const Alert = ({ children }) => {
  return (
    <div className="rounded-md bg-warning/10 dark:bg-warning-dark/10 p-4 transition-colors duration-200">
      <div className="flex">
        <ExclamationCircleIcon className="h-5 w-5 text-warning dark:text-warning-dark transition-colors duration-200" aria-hidden="true" />
        <div className="ml-3">
          <p className="text-sm text-warning-dark dark:text-warning-light transition-colors duration-200">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
};

const Checkbox = ({ checked, onChange, label, ariaLabel }) => {
  return (
    <div className="flex justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-primary dark:text-primary-light border-border-light dark:border-border-dark-mode rounded focus:ring-primary dark:focus:ring-primary-light transition-colors duration-200"
        aria-label={ariaLabel || label}
      />
      {label && (
        <span className="ml-2 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
          {label}
        </span>
      )}
    </div>
  );
};

const StudentDaysSection = ({ students }) => {
  const formik = useFormikContext();
  const { theme } = useContext(ThemeContext);
  
  const studentsArray = useMemo(() => {
    if (Array.isArray(students)) {
      return students;
    } else if (students && students.data && Array.isArray(students.data)) {
      return students.data;
    } else if (students && typeof students === 'object') {
      return Object.values(students).filter(item => item && typeof item === 'object');
    }
    return [];
  }, [students]);
  
  const operatingDays = formik.values.operatingDays || [];
  
  const allStops = useMemo(() => [
    formik.values.stops.startingStop,
    ...(formik.values.stops.intermediateStops || []),
    formik.values.stops.endingStop
  ].filter(Boolean), [formik.values.stops]);

  const uniqueStudentIds = useMemo(() => [
    ...new Set(
      allStops.flatMap(stop => {
        if (!stop || !stop.students) return [];
        
        return stop.students.map(s => {
          if (typeof s.student === 'object' && s.student?._id) {
            return s.student._id;
          }
          return s.student;
        }).filter(Boolean);
      })
    )
  ], [allStops]);

  const handleStudentAllDays = useCallback((studentId, checked) => {
    const currentDays = [...(formik.values.dayWiseStudents || [])];
    
    if (checked) {
      operatingDays.forEach(day => {
        const dayEntry = currentDays.find(d => d.day === day) || { day, students: [] };
        if (!dayEntry.students.includes(studentId)) {
          const updatedStudents = [...dayEntry.students, studentId];
          const dayIndex = currentDays.findIndex(d => d.day === day);
          if (dayIndex === -1) {
            currentDays.push({ day, students: updatedStudents });
          } else {
            currentDays[dayIndex] = { day, students: updatedStudents };
          }
        }
      });
    } else {
      operatingDays.forEach(day => {
        const dayIndex = currentDays.findIndex(d => d.day === day);
        if (dayIndex !== -1) {
          currentDays[dayIndex] = {
            ...currentDays[dayIndex],
            students: currentDays[dayIndex].students.filter(id => id !== studentId)
          };
        }
      });
    }

    formik.setFieldValue('dayWiseStudents', currentDays.filter(d => d.students.length > 0));
  }, [formik, operatingDays]);

  const handleDayAllStudents = useCallback((day, checked) => {
    const currentDays = [...(formik.values.dayWiseStudents || [])];
    const dayIndex = currentDays.findIndex(d => d.day === day);
    
    if (checked) {
      if (dayIndex === -1) {
        currentDays.push({ day, students: uniqueStudentIds });
      } else {
        currentDays[dayIndex] = { day, students: uniqueStudentIds };
      }
    } else {
      if (dayIndex !== -1) {
        currentDays.splice(dayIndex, 1);
      }
    }

    formik.setFieldValue('dayWiseStudents', currentDays);
  }, [formik, uniqueStudentIds]);

  const handleDayToggle = useCallback((studentId, day) => {
    const currentDays = [...(formik.values.dayWiseStudents || [])];
    const dayEntry = currentDays.find(d => d.day === day) || { day, students: [] };
    
    const updatedStudents = dayEntry.students.includes(studentId)
      ? dayEntry.students.filter(id => id !== studentId)
      : [...dayEntry.students, studentId];

    const updatedDays = currentDays
      .filter(d => d.day !== day)
      .concat({ day, students: updatedStudents })
      .filter(d => d.students.length > 0);

    formik.setFieldValue('dayWiseStudents', updatedDays);
  }, [formik]);

  const isStudentSelectedForDay = useCallback((studentId, day) => {
    const dayEntry = formik.values.dayWiseStudents?.find(d => d.day === day);
    
    if (!dayEntry) return false;
    
    return dayEntry.students.some(student => {
      if (typeof student === 'string') {
        return student === studentId;
      } else if (typeof student === 'object' && student._id) {
        return student._id === studentId;
      }
      return false;
    });
  }, [formik.values.dayWiseStudents]);

  const isAllDaysSelected = useCallback((studentId) => {
    return operatingDays.every(day => isStudentSelectedForDay(studentId, day));
  }, [operatingDays, isStudentSelectedForDay]);

  const isAllStudentsSelected = useCallback((day) => {
    return uniqueStudentIds.every(studentId => isStudentSelectedForDay(studentId, day));
  }, [uniqueStudentIds, isStudentSelectedForDay]);
  
  const getStudentName = useCallback((studentId) => {
    if (typeof studentId === 'object' && studentId.firstName) {
      return `${studentId.firstName} ${studentId.lastName || ''}`;
    }
    
    if (Array.isArray(studentsArray)) {
      const student = studentsArray.find(s => s && s._id === studentId);
      if (student) {
        return `${student.firstName || ''} ${student.lastName || ''}`;
      }
    }
    
    return `Student (${typeof studentId === 'string' ? studentId.substring(0, 6) + '...' : 'unknown'})`;
  }, [studentsArray]);

  const formatDayName = useCallback((day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  }, []);

  if (uniqueStudentIds.length === 0) {
    return <Alert>Add students to stops first to configure their schedules</Alert>;
  }

  if (operatingDays.length === 0) {
    return <Alert>Select operating days in the Basic Details section first</Alert>;
  }

  return (
    <div className="mt-8 bg-surface dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark-mode transition-colors duration-200">
      <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary mb-4 transition-colors duration-200">
        Student Schedule
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-surface-secondary dark:bg-surface-dark-secondary text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                Student
              </th>
              {operatingDays.map(day => (
                <th key={day} className="px-6 py-3 bg-surface-secondary dark:bg-surface-dark-secondary text-center text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                  <div className="flex flex-col items-center space-y-2">
                    <span>{formatDayName(day)}</span>
                    <Checkbox
                      checked={isAllStudentsSelected(day)}
                      onChange={(e) => handleDayAllStudents(day, e.target.checked)}
                      ariaLabel={`Select all students for ${day}`}
                    />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 bg-surface-secondary dark:bg-surface-dark-secondary text-center text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">
                All Days
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
            {uniqueStudentIds.map(studentId => (
              <tr key={studentId} className="hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                  {getStudentName(studentId)}
                </td>
                {operatingDays.map(day => (
                  <td key={day} className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    <Checkbox
                      checked={isStudentSelectedForDay(studentId, day)}
                      onChange={() => handleDayToggle(studentId, day)}
                      ariaLabel={`${getStudentName(studentId)} participates on ${day}`}
                    />
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  <Checkbox
                    checked={isAllDaysSelected(studentId)}
                    onChange={(e) => handleStudentAllDays(studentId, e.target.checked)}
                    ariaLabel={`${getStudentName(studentId)} participates on all days`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired
};

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  ariaLabel: PropTypes.string
};

StudentDaysSection.propTypes = {
  students: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
};

export default StudentDaysSection;