import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import { ThemeContext } from '@context/ThemeContext';

const StudentModal = ({ isOpen, onClose, title, students = [], onAddStudent }) => {
  const { theme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');

  let studentsArray = [];
  
  if (Array.isArray(students)) {
    studentsArray = students;
  } else if (students && students.data && Array.isArray(students.data)) {
    studentsArray = students.data;
  } else if (students && typeof students === 'object') {
    studentsArray = Object.values(students).filter(item => item && typeof item === 'object');
  }
  
  const filteredStudents = studentsArray.filter(student => {
    if (!student) return false;
    
    const firstName = student.firstName || '';
    const lastName = student.lastName || '';
    return `${firstName} ${lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 transition-colors duration-200" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-surface dark:bg-surface-dark rounded-xl shadow-lg transition-colors duration-200">
          <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark-mode transition-colors duration-200">
            <div>
              <Dialog.Title className="text-lg font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                {title}
              </Dialog.Title>
              <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                Add students to the job
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-text-tertiary dark:text-text-dark-tertiary hover:text-text-secondary dark:hover:text-text-dark-secondary transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {studentsArray.length > 0 && (
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search students..."
                    className="block w-full pl-10 pr-3 py-2 border border-border-light dark:border-border-dark-mode rounded-md leading-5 bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark-primary placeholder-text-tertiary dark:placeholder-text-dark-tertiary focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-primary-light focus:border-primary dark:focus:border-primary-light transition-colors duration-200"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {!studentsArray.length ? (
                <div className="text-center py-6 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  No students available
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-6 text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
                  No students found matching your search
                </div>
              ) : (
                filteredStudents.map((student, index) => (
                  <div
                    key={student._id || index}
                    className="flex items-center justify-between p-4 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded-lg transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary-light/20 dark:bg-primary/20 flex items-center justify-center transition-colors duration-200">
                        <span className="text-primary-dark dark:text-primary-light font-medium transition-colors duration-200">
                          {(student.firstName || '?').charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary transition-colors duration-200">
                          {student.firstName || ''} {student.lastName || ''}
                        </p>
                        <p className="text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">{student.grade || 'N/A'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddStudent(student)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-dark dark:text-primary-light bg-primary-light/20 dark:bg-primary/20 hover:bg-primary-light/30 dark:hover:bg-primary/30 transition-colors duration-200"
                    >
                      <UserPlusIcon className="h-4 w-4 mr-1.5" />
                      Add Student
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

StudentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  students: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  onAddStudent: PropTypes.func.isRequired
};

export default StudentModal;