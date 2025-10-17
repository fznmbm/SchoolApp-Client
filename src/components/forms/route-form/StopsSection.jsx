import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import { FieldArray, useFormikContext } from "formik";
import {
  PlusCircleIcon,
  MinusCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import StudentModal from "@/components/forms/route-form/components/StudentSelectionModal";
import NewStudentModal from "@/components/forms/route-form/components/NewStudentModal";
import NewSchoolModal from "@/components/forms/route-form/components/NewSchoolModal";
import Select from "@/components/common/input/Select";
import Input from "@/components/common/input/Input";
import { ThemeContext } from '@context/ThemeContext';
import PropTypes from 'prop-types';
import { Button } from "@/components/common/Button";

const ValidationError = ({ message }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="rounded-md bg-error/10 dark:bg-error-dark/10 p-4 transition-colors duration-200">
      <div className="flex">
        <ExclamationCircleIcon className="h-5 w-5 text-error dark:text-error-dark transition-colors duration-200" aria-hidden="true" />
        <div className="ml-3">
          <p className="text-sm font-medium text-error-dark dark:text-error-light transition-colors duration-200">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

const FieldError = ({ message }) => {
  return message ? (
    <p className="mt-1 text-sm text-error dark:text-error-light transition-colors duration-200">
      {message}
    </p>
  ) : null;
};

const StudentItem = ({ student, onRemove, getStudentName }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex items-center justify-between p-3 bg-surface-secondary dark:bg-surface-dark-secondary rounded-md transition-colors duration-200">
      <div>
        <span className="font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          {getStudentName(student)}
        </span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-text-tertiary dark:text-text-dark-tertiary hover:text-error dark:hover:text-error-light transition-colors duration-200"
        aria-label="Remove student"
      >
        <MinusCircleIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

const StopField = ({ fieldPath, label, schools, students, onRemove, onAddNewStudent, onAddNewSchool }) => {
  const { theme } = useContext(ThemeContext);
  const formik = useFormikContext();
  const [isSchool, setIsSchool] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

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

  const isStartingStop = fieldPath === "startingStop";
  const isEndingStop = fieldPath === "endingStop";

  const stopPath = useMemo(() => {
    return fieldPath.includes("intermediateStops")
      ? `stops.intermediateStops.${fieldPath.split(".")[1]}`
      : `stops.${fieldPath}`;
  }, [fieldPath]);

  const currentStopStudents = useMemo(() => {
    return fieldPath.includes("intermediateStops")
      ? formik.values.stops.intermediateStops[fieldPath.split(".")[1]]?.students || []
      : formik.values.stops[fieldPath]?.students || [];
  }, [fieldPath, formik.values.stops]);

  useEffect(() => {
    const stopData = fieldPath.includes("intermediateStops")
      ? formik.values.stops.intermediateStops[fieldPath.split(".")[1]]
      : formik.values.stops[fieldPath];
    
    if (stopData) {
      setIsSchool(!!stopData.isSchool);
    }
  }, [fieldPath, formik.values.stops]);

  const schoolOptions = useMemo(() => {
    if (!Array.isArray(schools)) return [];
    
    return schools.map((school) => ({
      id: school._id,
      name: school.name,
    }));
  }, [schools]);

  const handleSchoolToggle = useCallback((e) => {
    const checked = e.target.checked;
    setIsSchool(checked);
  
    formik.setFieldValue(`${stopPath}.isSchool`, checked);
    
    if (checked) {
      formik.setFieldValue(`${stopPath}.location`, "");
      formik.setFieldValue(`${stopPath}.schoolId`, "");
      
      // Auto-select the student's school if there are students assigned to this stop
      if (currentStopStudents.length > 0) {
        const firstStudentEntry = currentStopStudents[0];
        let studentId = null;
        
        if (typeof firstStudentEntry.student === 'object') {
          studentId = firstStudentEntry.student._id;
        } else {
          studentId = firstStudentEntry.student;
        }
        
        if (studentId && studentsArray.length > 0) {
          const studentData = studentsArray.find(s => s && s._id === studentId);
          
          // If student has a school, auto-select it
          if (studentData && studentData.school && studentData.school._id) {
            const schoolId = studentData.school._id;
            const school = Array.isArray(schools) 
              ? schools.find((s) => s._id === schoolId) 
              : null;
            
            if (school) {
              formik.setFieldValue(`${stopPath}.schoolId`, schoolId);
              formik.setFieldValue(`${stopPath}.location`, school.name);
              
              if (school.operatingHours) {
                if (school.operatingHours.startTime) {
                  formik.setFieldValue(`${stopPath}.timeAM`, school.operatingHours.startTime);
                } else {
                  formik.setFieldValue(`${stopPath}.timeAM`, "");
                }
                
                if (school.operatingHours.endTime) {
                  formik.setFieldValue(`${stopPath}.timePM`, school.operatingHours.endTime);
                } else {
                  formik.setFieldValue(`${stopPath}.timePM`, "");
                }
              } else {
                formik.setFieldValue(`${stopPath}.timeAM`, "");
                formik.setFieldValue(`${stopPath}.timePM`, "");
              }
            }
          }
        }
      }
    } else {
      formik.setFieldValue(`${stopPath}.location`, "");
      formik.setFieldValue(`${stopPath}.schoolId`, null);
      formik.setFieldValue(`${stopPath}.timeAM`, "");
      formik.setFieldValue(`${stopPath}.timePM`, "");
    }
  }, [formik, stopPath, currentStopStudents, studentsArray, schools]);

  const handleSchoolChange = useCallback((selectedOption) => {
    const schoolId = selectedOption?.id || "";
    const school = Array.isArray(schools) 
      ? schools.find((s) => s._id === schoolId) 
      : null;

    if (school) {
      formik.setFieldValue(`${stopPath}.schoolId`, schoolId);
      formik.setFieldValue(`${stopPath}.location`, school.name);
      
      if (school.operatingHours) {
        if (school.operatingHours.startTime) {
          formik.setFieldValue(`${stopPath}.timeAM`, school.operatingHours.startTime);
        } else {
          formik.setFieldValue(`${stopPath}.timeAM`, "");
        }
        
        if (school.operatingHours.endTime) {
          formik.setFieldValue(`${stopPath}.timePM`, school.operatingHours.endTime);
        } else {
          formik.setFieldValue(`${stopPath}.timePM`, "");
        }
      } else {
        formik.setFieldValue(`${stopPath}.timeAM`, "");
        formik.setFieldValue(`${stopPath}.timePM`, "");
      }
    } else {
      formik.setFieldValue(`${stopPath}.schoolId`, "");
      formik.setFieldValue(`${stopPath}.location`, "");
      formik.setFieldValue(`${stopPath}.timeAM`, "");
      formik.setFieldValue(`${stopPath}.timePM`, "");
    }
  }, [formik, schools, stopPath]);

  const isStudentsRequired = isStartingStop || isEndingStop;
  const isStudentsMissing = isStudentsRequired && currentStopStudents.length === 0;
    
  useEffect(() => {
    if (isStudentsMissing) {
      formik.setFieldError(
        `${stopPath}.students`,
        `${isStartingStop ? "Starting" : "Ending"} stop must have at least one student`
      );
    } else {
      formik.setFieldError(`${stopPath}.students`, undefined);
    }
  }, [currentStopStudents.length, isStudentsMissing, stopPath, isStartingStop, formik]);

  useEffect(() => {
    const stop = fieldPath.includes("intermediateStops")
      ? formik.values.stops.intermediateStops[fieldPath.split(".")[1]]
      : formik.values.stops[fieldPath];
      
    if (stop && stop.location) {  
      if (!stop.timeAM) {
        formik.setFieldError(`${stopPath}.timeAM`, "AM time is required");
      } else {
        formik.setFieldError(`${stopPath}.timeAM`, undefined);
      }
      
      if (!stop.timePM) {
        formik.setFieldError(`${stopPath}.timePM`, "PM time is required");
      } else {
        formik.setFieldError(`${stopPath}.timePM`, undefined);
      }
    }
  }, [fieldPath, stopPath, formik.values.stops, formik]);

  const handleStudentRemoval = useCallback((index) => {
    const newStudents = [...currentStopStudents];
    newStudents.splice(index, 1);
    formik.setFieldValue(`${stopPath}.students`, newStudents);
  }, [currentStopStudents, formik, stopPath]);

  const getStudentName = useCallback((studentEntry) => {
    if (studentEntry.student && typeof studentEntry.student === 'object') {
      return `${studentEntry.student.firstName || ''} ${studentEntry.student.lastName || ''}`;
    }
    
    const studentId = typeof studentEntry.student === 'string' ? studentEntry.student : null;
    if (studentId && studentsArray.length > 0) {
      const studentData = studentsArray.find(s => s && s._id === studentId);
      return studentData ? `${studentData.firstName || ''} ${studentData.lastName || ''}` : 'Unknown Student';
    }
    
    return 'Unknown Student';
  }, [studentsArray]);

  const handleAddStudent = useCallback((student) => {
    const isAlreadyAdded = currentStopStudents.some(
      (s) => {
        if (typeof s.student === 'object') {
          return s.student._id === student._id;
        }
        return s.student === student._id;
      }
    );
    
    if (!isAlreadyAdded) {
      formik.setFieldValue(`${stopPath}.students`, [
        ...currentStopStudents,
        {
          student: student._id
        },
      ]);
  
      // Auto-fill address if location is empty and student has parent address
      const stopLocation = fieldPath.includes("intermediateStops")
        ? formik.values.stops.intermediateStops[fieldPath.split(".")[1]]?.location
        : formik.values.stops[fieldPath]?.location;
      
      if (!stopLocation && !isSchool && student.parents && student.parents.length > 0) {
        const parentAddress = student.parents[0].address;
        if (parentAddress && parentAddress.street) {
          const formattedAddress = `${parentAddress.street}${parentAddress.city ? `, ${parentAddress.city}` : ''}`;
          formik.setFieldValue(`${stopPath}.location`, formattedAddress);
        }
      }
  
      if (isSchool && student.school && student.school._id) {
        formik.setFieldValue(`${stopPath}.schoolId`, student.school._id);
        formik.setFieldValue(`${stopPath}.location`, student.school.name);
        
        // If the school has operating hours, set the AM/PM times
        const school = Array.isArray(schools) 
          ? schools.find((s) => s._id === student.school._id) 
          : null;
        
        if (school && school.operatingHours) {
          if (school.operatingHours.startTime) {
            formik.setFieldValue(`${stopPath}.timeAM`, school.operatingHours.startTime);
          }
          
          if (school.operatingHours.endTime) {
            formik.setFieldValue(`${stopPath}.timePM`, school.operatingHours.endTime);
          }
        }
      }
    }
    setIsStudentModalOpen(false);
  }, [currentStopStudents, formik, stopPath, isSchool, schools, fieldPath]);

  return (
    <div className="bg-surface dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark-mode transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          {label}
        </h4>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-text-tertiary dark:text-text-dark-tertiary hover:text-error dark:hover:text-error-light transition-colors duration-200"
            aria-label="Remove stop"
          >
            <MinusCircleIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSchool}
            onChange={handleSchoolToggle}
            className="h-4 w-4 text-primary dark:text-primary-light border-border-light dark:border-border-dark-mode rounded focus:ring-primary-light dark:focus:ring-primary transition-colors duration-200"
          />
          <span className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
            This is a school
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Location or School selection */}
        <div>
          {isSchool ? (
            <Select
              label="School"
              name={`${stopPath}.schoolId`}
              options={schoolOptions}
              placeholder="Select School"
              onChange={handleSchoolChange}
            />
          ) : (
            <Input
              label="Location"
              name={`${stopPath}.location`}
              type="text"
              placeholder="Enter location"
            />
          )}
        </div>

        {/* AM Time */}
        <div>
          <Input
            label="AM Time *"
            name={`${stopPath}.timeAM`}
            type="time"
          />
          <FieldError message={formik.errors[`${stopPath}.timeAM`]} />
        </div>

        {/* PM Time */}
        <div>
          <Input
            label="PM Time *"
            name={`${stopPath}.timePM`}
            type="time"
          />
          <FieldError message={formik.errors[`${stopPath}.timePM`]} />
        </div>
      </div>

      {/* Students section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h5 className="text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
              Students at this stop
              {isStudentsRequired && " *"}
            </h5>
            {isStudentsMissing && (
              <span className="text-sm text-error dark:text-error-light flex items-center transition-colors duration-200">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                At least one student is required
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsStudentModalOpen(true)}
            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200
              ${
                isStudentsMissing
                  ? "text-error dark:text-error-light bg-error/10 dark:bg-error-dark/10 hover:bg-error/20 dark:hover:bg-error-dark/20"
                  : "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary-dark/10 hover:bg-primary/20 dark:hover:bg-primary-dark/20"
              }`}
          >
            <PlusCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
            Add Student
          </button>
        </div>

        <div className="space-y-2">
          {currentStopStudents.length > 0 ? (
            currentStopStudents.map((student, index) => (
              <StudentItem
                key={index}
                student={student}
                onRemove={() => handleStudentRemoval(index)}
                getStudentName={getStudentName}
              />
            ))
          ) : (
            <div className="text-sm text-text-tertiary dark:text-text-dark-tertiary italic py-2 transition-colors duration-200">
              No students assigned to this stop
            </div>
          )}
        </div>

        <StudentModal
          isOpen={isStudentModalOpen}
          onClose={() => setIsStudentModalOpen(false)}
          title={`Add Student to ${label}`}
          students={students}
          onAddStudent={handleAddStudent}
        />
      </div>
    </div>
  );
};

const StopsSection = ({ schools, students, onRefresh }) => {
  const { theme } = useContext(ThemeContext);
  const formik = useFormikContext();
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isNewSchoolModalOpen, setIsNewSchoolModalOpen] = useState(false);
  const [localSchools, setLocalSchools] = useState(schools);
  const [localStudents, setLocalStudents] = useState(students);
  const queryClient = useQueryClient();

  useEffect(() => {
    setLocalSchools(schools);
  }, [schools]);

  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  const studentsArray = useMemo(() => {
    if (Array.isArray(localStudents)) {
      return localStudents;
    } else if (localStudents && localStudents.data && Array.isArray(localStudents.data)) {
      return localStudents.data;
    } else if (localStudents && typeof localStudents === 'object') {
      return Object.values(localStudents).filter(item => item && typeof item === 'object');
    }
    return [];
  }, [localStudents]);

  const findStudentById = useCallback((studentId) => {
    if (!studentId) return null;
    return studentsArray.find(s => s && s._id === studentId) || null;
  }, [studentsArray]);

  const getStudentName = useCallback((studentId) => {
    const student = findStudentById(studentId);
    if (student) {
      return `${student.firstName || ''} ${student.lastName || ''}`;
    }
    return `Student (${typeof studentId === 'string' ? studentId.substring(0, 6) + '...' : 'unknown'})`;
  }, [findStudentById]);

  useEffect(() => {
    const startingStudents = formik.values.stops.startingStop?.students || [];
    const endingStudents = formik.values.stops.endingStop?.students || [];

    if (startingStudents.length === 0 || endingStudents.length === 0) {
      formik.setFieldError(
        "stops",
        "Both starting and ending stops must have at least one student"
      );
    } else {
      formik.setFieldError("stops", undefined);
    }
  }, [
    formik.values.stops.startingStop?.students,
    formik.values.stops.endingStop?.students,
    formik
  ]);

  useEffect(() => {
    const allStops = [
      { ...formik.values.stops.startingStop, type: 'startingStop' },
      ...formik.values.stops.intermediateStops.map((stop, index) => ({
        ...stop,
        type: `intermediateStop-${index}`
      })),
      { ...formik.values.stops.endingStop, type: 'endingStop' }
    ];
    
    const stopsWithMissingTimes = allStops
      .filter(stop => stop.location) 
      .filter(stop => !stop.timeAM || !stop.timePM);
    
    if (stopsWithMissingTimes.length > 0) {
      formik.setFieldError(
        "stops",
        "All stops must have both AM and PM times"
      );
    }
  }, [formik.values.stops, formik]);

  useEffect(() => {
    const getStudentId = (studentEntry) => {
      if (studentEntry.student && typeof studentEntry.student === 'object') {
        return studentEntry.student._id;
      }
      return typeof studentEntry.student === 'string' ? studentEntry.student : null;
    };

    const allStops = [
      { ...formik.values.stops.startingStop, type: 'startingStop' },
      ...formik.values.stops.intermediateStops.map((stop, index) => ({
        ...stop,
        type: `intermediateStop-${index}`
      })),
      { ...formik.values.stops.endingStop, type: 'endingStop' }
    ];

    const studentMap = new Map(); 
    
    allStops.forEach(stop => {
      const isSchoolStop = !!stop.isSchool;
      
      (stop.students || []).forEach(studentEntry => {
        const studentId = getStudentId(studentEntry);
        if (!studentId) return;
        
        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, { schoolStops: [], nonSchoolStops: [] });
        }
        
        const studentRecord = studentMap.get(studentId);
        if (isSchoolStop) {
          studentRecord.schoolStops.push(stop.type);
        } else {
          studentRecord.nonSchoolStops.push(stop.type);
        }
      });
    });

    const invalidStudents = [];
    
    studentMap.forEach((record, studentId) => {
      const studentName = getStudentName(studentId);
      
      if (record.schoolStops.length === 0) {
        invalidStudents.push(`${studentName} must be assigned to at least one school stop`);
      } else if (record.schoolStops.length > 1) {
        invalidStudents.push(`${studentName} cannot be assigned to multiple school stops (${record.schoolStops.length} currently)`);
      }
      
      if (record.nonSchoolStops.length === 0) {
        invalidStudents.push(`${studentName} must be assigned to at least one non-school stop (home)`);
      } else if (record.nonSchoolStops.length > 1) {
        invalidStudents.push(`${studentName} cannot be assigned to multiple non-school stops (${record.nonSchoolStops.length} currently)`);
      }
    });
    
    if (invalidStudents.length > 0) {
      formik.setFieldError(
        "stops",
        `Student assignment issues: ${invalidStudents.join('; ')}`
      );
    }
  }, [formik.values.stops, getStudentName, formik]);

  const addIntermediateStop = useCallback(() => {
    return {
      location: "",
      isSchool: false,
      schoolId: null,
      timeAM: "",
      timePM: "",
      students: [],
    };
  }, []);

  const handleNewStudentCreated = useCallback((newStudent) => {
    setIsNewStudentModalOpen(false);
    
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 rounded-md p-4 shadow-lg z-50 transition-opacity duration-500';
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="h-5 w-5 mr-2 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Student ${newStudent.firstName} ${newStudent.lastName} added successfully!</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 4000);
    
    if (Array.isArray(localStudents)) {
      setLocalStudents([...localStudents, newStudent]);
    } else if (localStudents && localStudents.data && Array.isArray(localStudents.data)) {
      const updatedData = [...localStudents.data, newStudent];
      setLocalStudents({...localStudents, data: updatedData});
    }
    
    if (queryClient) {
      queryClient.invalidateQueries('students');
    }
    
    if (onRefresh) {
      onRefresh();
    }
  }, [localStudents, queryClient, onRefresh]);

  const handleNewSchoolCreated = useCallback((newSchool) => {
    setIsNewSchoolModalOpen(false);
    
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 rounded-md p-4 shadow-lg z-50 transition-opacity duration-500';
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="h-5 w-5 mr-2 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>School ${newSchool.name} added successfully!</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 4000);
    
    if (Array.isArray(localSchools)) {
      setLocalSchools([...localSchools, newSchool]);
    } else if (localSchools && localSchools.data && Array.isArray(localSchools.data)) {
      const updatedData = [...localSchools.data, newSchool];
      setLocalSchools({...localSchools, data: updatedData});
    }
    
    if (queryClient) {
      queryClient.invalidateQueries('schools');
    }
    
    if (onRefresh) {
      onRefresh();
    }
  }, [localSchools, queryClient, onRefresh]);

  return (
    <div className="space-y-8">
      {/* Quick Actions Buttons */}
      <div className="flex justify-end gap-3 mb-4">
        <Button
          variant="primary"
          type="button"
          onClick={() => setIsNewStudentModalOpen(true)}
          className="inline-flex items-center py-2 px-4"
          size="sm"
        >
          <PlusCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          Student
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={() => setIsNewSchoolModalOpen(true)}
          className="inline-flex items-center py-2 px-4"
          size="sm"
        >
          <PlusCircleIcon className="h-4 w-4 mr-1" aria-hidden="true" />
          School
        </Button>
      </div>

      {formik.errors.stops && typeof formik.errors.stops === "string" && (
        <ValidationError message={formik.errors.stops} />
      )}
      
      <StopField
        fieldPath="startingStop"
        label="Starting Stop"
        schools={schools}
        students={students}
        onAddNewStudent={() => setIsNewStudentModalOpen(true)}
        onAddNewSchool={() => setIsNewSchoolModalOpen(true)}
      />

      <FieldArray name="stops.intermediateStops">
        {({ push, remove }) => (
          <div className="space-y-4">
            <div className="space-y-4">
              {formik.values.stops.intermediateStops.map((_, index) => (
                <StopField
                  key={index}
                  fieldPath={`intermediateStops.${index}`}
                  label={`Stop ${index + 1}`}
                  schools={schools}
                  students={students}
                  onRemove={() => remove(index)}
                  onAddNewStudent={() => setIsNewStudentModalOpen(true)}
                  onAddNewSchool={() => setIsNewSchoolModalOpen(true)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => push(addIntermediateStop())}
              className="inline-flex items-center px-4 py-2 border border-border-light dark:border-border-dark-mode
              shadow-sm text-sm font-medium rounded-md text-text-primary dark:text-text-dark-primary
              bg-surface dark:bg-surface-dark hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary transition-colors duration-200"
              aria-label="Add intermediate stop"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Intermediate Stop
            </button>
          </div>
        )}
      </FieldArray>

      <StopField
        fieldPath="endingStop"
        label="Ending Stop"
        schools={schools}
        students={students}
        onAddNewStudent={() => setIsNewStudentModalOpen(true)}
        onAddNewSchool={() => setIsNewSchoolModalOpen(true)}
      />

      {/* Modal for creating a new student */}
      {isNewStudentModalOpen && (
        <NewStudentModal
          isOpen={isNewStudentModalOpen}
          onClose={() => setIsNewStudentModalOpen(false)}
          onStudentCreated={handleNewStudentCreated}
          schools={schools}
        />
      )}

      {/* Modal for creating a new school */}
      {isNewSchoolModalOpen && (
        <NewSchoolModal
          isOpen={isNewSchoolModalOpen}
          onClose={() => setIsNewSchoolModalOpen(false)}
          onSchoolCreated={handleNewSchoolCreated}
        />
      )}
    </div>
  );
};

ValidationError.propTypes = {
  message: PropTypes.string.isRequired
};

FieldError.propTypes = {
  message: PropTypes.string
};

StudentItem.propTypes = {
  student: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  getStudentName: PropTypes.func.isRequired
};

StopField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  schools: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  students: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onRemove: PropTypes.func,
  onAddNewStudent: PropTypes.func.isRequired,
  onAddNewSchool: PropTypes.func.isRequired
};

StopsSection.propTypes = {
  schools: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  students: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onRefresh: PropTypes.func
};

export default StopsSection;