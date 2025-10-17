import React, { useState, useCallback, useMemo, useContext } from "react";
import { useFormikContext } from "formik";
import { ExclamationCircleIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Input from "@/components/common/input/Input";
import { ThemeContext } from '@context/ThemeContext';
import PropTypes from 'prop-types';

const SERVICE_TYPES = [
  { id: "EARLY_PICKUP", name: "Early Pickup" },
  { id: "LATE_PICKUP", name: "Late Pickup" },
  { id: "EXTRA_PICKUP", name: "Extra Pickup" },
  { id: "OTHER", name: "Other" }
];

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

const FieldError = ({ error }) => {
  if (!error) return null;
  
  return (
    <p className="mt-1 text-sm text-error dark:text-error-light transition-colors duration-200">
      {error}
    </p>
  );
};

const Select = ({ label, options, onChange, value, disabled, placeholder, name, required = false, error }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-text-primary dark:text-text-dark-primary mb-1.5 transition-colors duration-200"
        >
          {label}
          {required && <span className="text-error dark:text-error-light ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            block w-full rounded-lg px-3.5 py-2.5
            text-text-primary dark:text-text-dark-primary text-sm
            bg-surface dark:bg-surface-dark
            border transition-colors duration-200
            ${error ? 'border-error dark:border-error-light' : 'border-border-light dark:border-border-dark-mode'}
            ${error ? 'focus:border-error dark:focus:border-error-light focus:ring-error dark:focus:ring-error-light' : 'focus:border-primary dark:focus:border-primary-light focus:ring-primary dark:focus:ring-primary-light'}
            hover:border-border dark:hover:border-border-light
            shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-surface-secondary dark:disabled:bg-surface-dark-secondary 
            disabled:text-text-tertiary dark:disabled:text-text-dark-tertiary 
            disabled:cursor-not-allowed
          `}
          aria-required={required}
          aria-invalid={!!error}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(option => (
            <option key={option.id || option.value || option} value={option.id || option.value || option}>
              {option.name || option.label || option}
            </option>
          ))}
        </select>
      </div>
      {error && <FieldError error={error} />}
    </div>
  );
};

const ServiceActions = ({ service, onEdit, onDelete }) => {
  return (
    <div className="flex justify-end space-x-2">
      <button
        type="button"
        onClick={() => onEdit(service)}
        className="text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary transition-colors duration-200"
        aria-label={`Edit service for ${service.studentName}`}
      >
        <PencilIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(service)}
        className="text-error dark:text-error-light hover:text-error-dark dark:hover:text-error transition-colors duration-200"
        aria-label={`Delete service for ${service.studentName}`}
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

const EmptyState = ({ message }) => {
  return (
    <div className="text-center py-6 bg-surface-secondary dark:bg-surface-dark-secondary rounded-md border border-border-light dark:border-border-dark-mode transition-colors duration-200">
      <p className="text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
        {message}
      </p>
    </div>
  );
};

const SpecialServicesSection = ({ students }) => {
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
  
  const [addingService, setAddingService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [additionalCharge, setAdditionalCharge] = useState("");
  const [specialTime, setSpecialTime] = useState("");
  const [notes, setNotes] = useState("");
  
  const [errors, setErrors] = useState({});
  
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!selectedStudent) {
      newErrors.selectedStudent = "Student is required";
    }
    
    if (!selectedDay) {
      newErrors.selectedDay = "Day is required";
    }
    
    if (!serviceType) {
      newErrors.serviceType = "Service type is required";
    }
    
    if (!additionalCharge) {
      newErrors.additionalCharge = "Charge amount is required";
    } else if (isNaN(parseFloat(additionalCharge)) || parseFloat(additionalCharge) < 0) {
      newErrors.additionalCharge = "Charge must be a positive number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [selectedStudent, selectedDay, serviceType, additionalCharge]);
  
  const operatingDays = formik.values.operatingDays || [];
  
  const allStops = useMemo(() => [
    formik.values.stops.startingStop,
    ...(formik.values.stops.intermediateStops || []),
    formik.values.stops.endingStop
  ].filter(stop => stop && stop.location), [formik.values.stops]);
  
  const findStudentSpecialServices = useCallback((studentId, stop) => {
    if (!stop || !stop.students) return [];
    
    const studentEntry = stop.students.find(s => {
      const sid = typeof s.student === 'object' ? s.student._id : s.student;
      return sid === studentId;
    });
    
    return studentEntry?.specialServices || [];
  }, []);

  const findStudentById = useCallback((studentId) => {
    if (!studentId || !Array.isArray(studentsArray)) return null;
    return studentsArray.find(std => std && std._id === studentId) || null;
  }, [studentsArray]);
  
  // Calculate student's active days based on their day assignments
  const getStudentActiveDays = useCallback((studentId) => {
    if (!studentId) return [];
    
    return formik.values.dayWiseStudents
      ?.filter(day => {
        return Array.isArray(day.students) && day.students.some(student => {
          if (typeof student === 'string') {
            return student === studentId;
          } else if (typeof student === 'object' && student._id) {
            return student._id === studentId;
          }
          return false;
        });
      })
      .map(day => day.day) || [];
  }, [formik.values.dayWiseStudents]);
  
  // Get unique students from all stops
  const uniqueStudents = useMemo(() => {
    const result = {};
    
    allStops.forEach(stop => {
      if (!stop || !stop.students) return;
      
      stop.students.forEach(s => {
        const studentId = typeof s.student === 'object' ? s.student._id : s.student;
        if (!studentId) return;
        
        if (!result[studentId]) {
          const studentData = findStudentById(studentId);
          
          if (studentData) {
            // Determine the stop path and type
            const stopPath = stop === formik.values.stops.startingStop 
              ? 'startingStop' 
              : stop === formik.values.stops.endingStop 
                ? 'endingStop' 
                : `intermediateStops.${formik.values.stops.intermediateStops.indexOf(stop)}`;
                
            const stopType = stop === formik.values.stops.startingStop 
              ? 'Start' 
              : stop === formik.values.stops.endingStop 
                ? 'End' 
                : 'Intermediate';
                
            result[studentId] = {
              id: studentId,
              name: `${studentData.firstName || ''} ${studentData.lastName || ''}`,
              grade: studentData.grade,
              assignedDays: getStudentActiveDays(studentId),
              stop: {
                id: stop._id || `temp-${Math.random()}`,
                location: stop.location,
                isSchool: stop.isSchool,
                path: stopPath,
                type: stopType
              },
              specialServices: findStudentSpecialServices(studentId, stop)
            };
          }
        }
      });
    });
    
    return result;
  }, [allStops, findStudentSpecialServices, getStudentActiveDays, findStudentById, formik.values.stops]);
  
  const getAllSpecialServices = useCallback(() => {
    const services = [];
    
    Object.values(uniqueStudents).forEach(student => {
      if (student.specialServices?.length > 0) {
        student.specialServices.filter(s => s.isActive !== false).forEach(service => {
          services.push({
            ...service,
            studentId: student.id,
            studentName: student.name,
            stopId: student.stop.id,
            stopLocation: student.stop.location,
            stopType: student.stop.type,
            stopPath: student.stop.path
          });
        });
      }
    });
    
    return services;
  }, [uniqueStudents]);
  
  const handleSaveService = useCallback(() => {
    if (!validateForm()) {
      return;
    }
    
    const student = uniqueStudents[selectedStudent];
    if (!student) return;
    
    const newService = {
      dayOfWeek: selectedDay,
      serviceType,
      additionalCharge: parseFloat(additionalCharge),
      specialTime,
      notes,
      isActive: true
    };
    
    if (editingService && editingService._id) {
      newService._id = editingService._id;
    }
    
    const stopPath = student.stop.path;
    const fullStopPath = `stops.${stopPath}`;
    
    let stop;
    if (stopPath === 'startingStop') {
      stop = formik.values.stops.startingStop;
    } else if (stopPath === 'endingStop') {
      stop = formik.values.stops.endingStop;
    } else {
      const index = parseInt(stopPath.split('.')[1]);
      stop = formik.values.stops.intermediateStops[index];
    }
    
    if (!stop) return;
    
    const students = [...(stop.students || [])];
    const studentIndex = students.findIndex(s => {
      const sid = typeof s.student === 'object' ? s.student._id : s.student;
      return sid === selectedStudent;
    });
    
    if (studentIndex === -1) return;
    
    const specialServices = [...(students[studentIndex].specialServices || [])];
    
    if (editingService) {
      const serviceIndex = specialServices.findIndex(s => {
        if (s._id && editingService._id) {
          return s._id === editingService._id;
        }
        return (
          s.dayOfWeek === editingService.dayOfWeek &&
          s.serviceType === editingService.serviceType &&
          s.additionalCharge === editingService.additionalCharge
        );
      });
      
      if (serviceIndex !== -1) {
        specialServices[serviceIndex] = newService;
      } else {
        specialServices.push(newService);
      }
    } else {
      specialServices.push(newService);
    }
    
    students[studentIndex] = {
      ...students[studentIndex],
      specialServices
    };
    
    formik.setFieldValue(`${fullStopPath}.students`, students);
    
    resetForm();
  }, [
    selectedStudent, 
    selectedDay, 
    serviceType, 
    additionalCharge, 
    specialTime, 
    notes, 
    editingService, 
    uniqueStudents, 
    formik,
    validateForm
  ]);
  
  const handleDeleteService = useCallback((service) => {
    const studentId = service.studentId;
    const stopPath = service.stopPath;
    const fullStopPath = `stops.${stopPath}`;
    
    let stop;
    if (stopPath === 'startingStop') {
      stop = formik.values.stops.startingStop;
    } else if (stopPath === 'endingStop') {
      stop = formik.values.stops.endingStop;
    } else {
      const index = parseInt(stopPath.split('.')[1]);
      stop = formik.values.stops.intermediateStops[index];
    }
    
    if (!stop) return;
    
    const students = [...(stop.students || [])];
    const studentIndex = students.findIndex(s => {
      const sid = typeof s.student === 'object' ? s.student._id : s.student;
      return sid === studentId;
    });
    
    if (studentIndex === -1) return;
    
    let specialServices = [...(students[studentIndex].specialServices || [])];
    
    if (service._id) {
      specialServices = specialServices.map(s => 
        s._id === service._id ? { ...s, isActive: false } : s
      );
    } else {
      specialServices = specialServices.filter(s => !(
        s.dayOfWeek === service.dayOfWeek && 
        s.serviceType === service.serviceType && 
        s.additionalCharge === service.additionalCharge
      ));
    }
    
    students[studentIndex] = {
      ...students[studentIndex],
      specialServices
    };
    
    formik.setFieldValue(`${fullStopPath}.students`, students);
  }, [formik]);
  
  const handleEditService = useCallback((service) => {
    setEditingService(service);
    setSelectedStudent(service.studentId);
    setSelectedDay(service.dayOfWeek);
    setServiceType(service.serviceType);
    setAdditionalCharge(service.additionalCharge.toString());
    setSpecialTime(service.specialTime || "");
    setNotes(service.notes || "");
    setAddingService(true);
  }, []);
  
  const resetForm = useCallback(() => {
    setAddingService(false);
    setEditingService(null);
    setSelectedStudent("");
    setSelectedDay("");
    setServiceType("");
    setAdditionalCharge("");
    setSpecialTime("");
    setNotes("");
    setErrors({});
  }, []);
  
  const allSpecialServices = useMemo(() => getAllSpecialServices(), [getAllSpecialServices]);
  
  const getActiveDaysOptions = useCallback((studentId) => {
    const days = getStudentActiveDays(studentId);
    return days.map(day => ({
      id: day,
      name: day.charAt(0).toUpperCase() + day.slice(1)
    }));
  }, [getStudentActiveDays]);

  const studentOptions = useMemo(() => 
    Object.values(uniqueStudents).map(student => ({
      id: student.id,
      name: `${student.name}`
    })), 
    [uniqueStudents]
  );

  const dayOptions = useMemo(() => 
    selectedStudent ? getActiveDaysOptions(selectedStudent) : [],
    [selectedStudent, getActiveDaysOptions]
  );

  const getServiceTypeName = useCallback((serviceTypeId) => {
    return SERVICE_TYPES.find(t => t.id === serviceTypeId)?.name || serviceTypeId;
  }, []);

  const formatDayName = useCallback((day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  }, []);

  if (Object.keys(uniqueStudents).length === 0) {
    return <Alert>Add students to stops first to configure special services</Alert>;
  }

  if (operatingDays.length === 0) {
    return <Alert>Select operating days in the Basic Details section first</Alert>;
  }

  return (
    <div className="mt-8 bg-surface dark:bg-surface-dark p-6 rounded-lg border border-border-light dark:border-border-dark-mode transition-colors duration-200">
      {/* Header section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
          Special Services
        </h3>
        <button
          type="button"
          onClick={() => setAddingService(true)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-primary dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light transition-colors duration-200"
          aria-label="Add special service"
        >
          Add Special Service
        </button>
      </div>
      
      {/* Service form */}
      {addingService && (
        <div className="bg-surface-secondary dark:bg-surface-dark-secondary p-4 rounded-md mb-6 border border-border-light dark:border-border-dark-mode transition-colors duration-200">
          <h4 className="text-md font-medium text-text-primary dark:text-text-dark-primary mb-4 transition-colors duration-200">
            {editingService ? "Edit Special Service" : "Add Special Service"}
          </h4>
          
          {/* First row of form fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Select
                label="Student"
                name="selectedStudent"
                options={studentOptions}
                value={selectedStudent}
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                  // Reset day selection when student changes
                  setSelectedDay("");
                  setErrors({...errors, selectedStudent: undefined});
                }}
                disabled={!!editingService}
                placeholder="Select Student"
                required
                error={errors.selectedStudent}
              />
            </div>
            
            <div>
              <Select
                label="Day of Week"
                name="selectedDay"
                options={dayOptions}
                value={selectedDay}
                onChange={(e) => {
                  setSelectedDay(e.target.value);
                  setErrors({...errors, selectedDay: undefined});
                }}
                placeholder="Select Day"
                required
                error={errors.selectedDay}
              />
              {dayOptions.length === 0 && selectedStudent && (
                <p className="text-xs text-warning dark:text-warning-light mt-1 transition-colors duration-200">
                  This student is not assigned to any days. Please assign them in the schedule first.
                </p>
              )}
            </div>
            
            <div>
              <Select
                label="Service Type"
                name="serviceType"
                options={SERVICE_TYPES}
                value={serviceType}
                onChange={(e) => {
                  setServiceType(e.target.value);
                  setErrors({...errors, serviceType: undefined});
                }}
                placeholder="Select Type"
                required
                error={errors.serviceType}
              />
            </div>
          </div>
          
          {/* Second row of form fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Input
                label="Additional Charge (£)"
                name="additionalCharge"
                type="number"
                value={additionalCharge}
                onChange={(e) => {
                  setAdditionalCharge(e.target.value);
                  setErrors({...errors, additionalCharge: undefined});
                }}
                min="0"
                step="0.01"
                required
                error={errors.additionalCharge}
              />
            </div>
            
            <div>
              <Input
                label="Special Time"
                name="specialTime"
                type="time"
                value={specialTime}
                onChange={(e) => setSpecialTime(e.target.value)}
              />
            </div>
            
            <div>
              <Input
                label="Notes"
                name="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes"
              />
            </div>
          </div>
          
          {/* Form action buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center px-3 py-2 border border-border-light dark:border-border-dark-mode shadow-sm text-sm leading-4 font-medium rounded-md text-text-primary dark:text-text-dark-primary bg-surface dark:bg-surface-dark hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-light transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveService}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-light transition-colors duration-200"
            >
              {editingService ? "Update Service" : "Add Service"}
            </button>
          </div>
        </div>
      )}
      
      {/* Services table */}
      {allSpecialServices.length > 0 ? (
        <div className="overflow-x-auto rounded-md border border-border-light dark:border-border-dark-mode transition-colors duration-200">
          <table className="min-w-full divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
            <thead className="bg-surface-secondary dark:bg-surface-dark-secondary transition-colors duration-200">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">Student</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">Stop</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">Day</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">Service Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">Charge</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">Notes</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-secondary dark:text-text-dark-secondary uppercase tracking-wider transition-colors duration-200">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-surface dark:bg-surface-dark divide-y divide-border-light dark:divide-border-dark-mode transition-colors duration-200">
              {allSpecialServices.map((service, index) => (
                <tr key={service._id || `service-${index}`} className="hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                    {service.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    {service.stopLocation} ({service.stopType})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    {formatDayName(service.dayOfWeek)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    {getServiceTypeName(service.serviceType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    £{service.additionalCharge.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                    {service.specialTime || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary dark:text-text-dark-secondary truncate max-w-xs transition-colors duration-200">
                    {service.notes || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <ServiceActions 
                      service={service} 
                      onEdit={handleEditService} 
                      onDelete={handleDeleteService} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No special services added yet" />
      )}
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired
};

FieldError.propTypes = {
  error: PropTypes.string
};

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string
};

ServiceActions.propTypes = {
  service: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

EmptyState.propTypes = {
  message: PropTypes.string.isRequired
};

SpecialServicesSection.propTypes = {
  students: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ])
};

export default SpecialServicesSection;