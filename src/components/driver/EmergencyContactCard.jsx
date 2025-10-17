import React from 'react';

const EmergencyContactCard = ({ emergencyContact }) => {
  if (!emergencyContact) {
    return null;
  }
  
  return (
    <div className="bg-surface dark:bg-surface-dark shadow dark:shadow-gray-800 overflow-hidden sm:rounded-lg transition-colors duration-200">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-text-primary dark:text-white transition-colors duration-200">
          Emergency Contact
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Contact person in case of emergency
        </p>
      </div>
      <div className="border-t border-border-light dark:border-border-dark-mode transition-colors duration-200">
        <dl>
          <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">Name</dt>
            <dd className="mt-1 text-sm text-text-primary dark:text-white sm:mt-0 sm:col-span-2 transition-colors duration-200">
              {emergencyContact?.name}
            </dd>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Phone Number
            </dt>
            <dd className="mt-1 text-sm text-text-primary dark:text-white sm:mt-0 sm:col-span-2 transition-colors duration-200">
              {emergencyContact?.phoneNumber}
            </dd>
          </div>
          <div className="bg-surface dark:bg-surface-dark px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 transition-colors duration-200">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Relationship
            </dt>
            <dd className="mt-1 text-sm text-text-primary dark:text-white sm:mt-0 sm:col-span-2 transition-colors duration-200">
              {emergencyContact?.relationship || "Not specified"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default EmergencyContactCard;