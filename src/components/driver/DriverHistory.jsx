import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  UserIcon,
  TruckIcon,
  DocumentIcon,
  IdentificationIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export const DriverHistory = ({ history }) => {
  const getIcon = (field) => {
    if (field.includes('vehicle')) return TruckIcon;
    if (field.includes('documents')) return DocumentIcon;
    if (field.includes('license')) return IdentificationIcon;
    if (field.includes('address')) return MapPinIcon;
    if (field.includes('phone')) return PhoneIcon;
    if (field.includes('email')) return EnvelopeIcon;
    if (field.includes('status')) return CheckCircleIcon;
    if (field.includes('time') || field.includes('date')) return ClockIcon;
    return UserIcon;
  };

  const formatValue = (value, field) => {
    // Handle empty/null values with context-specific messages
    if (value === undefined || value === null || value === '') {
      if (field.includes('email')) return 'No email address';
      if (field.includes('phone')) return 'No phone number';
      if (field.includes('dateOfBirth')) return 'Not provided';
      if (field.includes('vehicle.documents')) return 'No document uploaded';
      if (field.includes('vehicle')) return 'No vehicle assigned';
      if (field.includes('document')) return 'No document uploaded';
      if (field.includes('address')) return 'No address provided';
      if (field.includes('emergencyContact')) return 'No emergency contact';
      if (field.includes('nationality')) return 'Not specified';
      return 'Not provided';
    }
    
    // Handle document changes
    if (field.includes('documents')) {
      if (typeof value === 'object') {
        const docInfo = [];
        if (value.type) {
          const docTypes = {
            'DBS': 'DBS Certificate',
            'LICENSE': 'Driver License',
            'TAXI_LICENSE': 'Taxi License',
            'MEDICAL_CERTIFICATE': 'Medical Certificate',
            'INSURANCE': 'Insurance Certificate',
            'INSPECTION': 'Vehicle Inspection',
            'MOT': 'MOT Certificate'
          };
          docInfo.push(docTypes[value.type] || value.type);
        }
        if (value.number) docInfo.push(`#${value.number}`);
        if (value.issuedDate) docInfo.push(`issued ${format(new Date(value.issuedDate), 'dd MMM yyyy')}`);
        if (value.expiryDate) docInfo.push(`expires ${format(new Date(value.expiryDate), 'dd MMM yyyy')}`);
        if (value.file?.fileName) docInfo.push(`(${value.file.fileName})`);
        return docInfo.join(' - ') || 'No document details';
      }
      return String(value);
    }

    // Handle vehicle changes
    if (field.includes('vehicle')) {
      if (typeof value === 'object') {

        
        const vehicleInfo = [];
        if (value.registrationNumber) vehicleInfo.push(value.registrationNumber);
        if (value.make) vehicleInfo.push(value.make);
        if (value.model) vehicleInfo.push(value.model);
        if (value.type) {
          const vehicleTypes = {
            'SALOON': 'Saloon',
            'ESTATE': 'Estate',
            'MPV': 'MPV',
            'WAV': 'WAV'
          };
          vehicleInfo.push(`(${vehicleTypes[value.type] || value.type})`);
        }
        if (value.capacity) vehicleInfo.push(`${value.capacity} seats`);
        return vehicleInfo.join(' ') || 'No vehicle details';
      }
      return String(value);
    }

    // Handle address changes
    if (field.includes('address')) {
      if (typeof value === 'object') {

        return [value.street, value.city, value.county, value.postCode]
          .filter(Boolean)
          .join(', ') || 'No address details';
      }
      return String(value);
    }

    // Handle dates
    if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
      return format(new Date(value), 'dd MMM yyyy');
    }

    // Handle status
    if (field.includes('status')) {
      const statusMappings = {
        'ACTIVE': 'Active',
        'INACTIVE': 'Inactive',
        'ON_LEAVE': 'On Leave',
        'PENDING': 'Pending',
        'APPROVED': 'Approved',
        'REJECTED': 'Rejected',
        'EXPIRED': 'Expired',
        'EXPIRING_SOON': 'Expiring Soon',
        'VALID': 'Valid'
      };
      return statusMappings[value] || value.replace(/_/g, ' ').toLowerCase();
    }

    // Handle emergency contact changes
    if (field.includes('emergencyContact')) {
      if (typeof value === 'object') {

        const contactInfo = [];
        if (value.name) contactInfo.push(value.name);
        if (value.relationship) contactInfo.push(`(${value.relationship})`);
        if (value.phoneNumber) contactInfo.push(value.phoneNumber);
        return contactInfo.join(' ') || 'No contact details';
      }
      return String(value);
    }

    // Handle training changes
    if (field.includes('trainings')) {
      if (typeof value === 'object') {

        const trainingInfo = [];
        if (value.training?.trainingName) trainingInfo.push(value.training.trainingName);
        // Support snapshots that use `name` instead of nested training object
        if (!value.training?.trainingName && value.name) trainingInfo.push(value.name);
        if (value.certificateNumber) trainingInfo.push(`#${value.certificateNumber}`);
        if (value.completionDate) trainingInfo.push(`completed ${format(new Date(value.completionDate), 'dd MMM yyyy')}`);
        if (value.expiryDate) trainingInfo.push(`expires ${format(new Date(value.expiryDate), 'dd MMM yyyy')}`);
        return trainingInfo.join(' - ') || 'No training details';
      }
      return String(value);
    }

    // Handle boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) return 'None';
      return value.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item.name || item.id || JSON.stringify(item);
        }
        return String(item);
      }).join(', ');
    }

    return String(value);
  };

  const getFieldDisplayName = (field) => {
    const fieldMappings = {
      // Basic Info
      'name': 'Driver Name',
      'shortName': 'Short Name',
      'phoneNumber': 'Phone Number',
      'email': 'Email Address',
      'dateOfBirth': 'Date of Birth',
      'nationality': 'Nationality',
      
      // Address
      'address': 'Full Address',
      'address.street': 'Street Address',
      'address.city': 'City',
      'address.county': 'County',
      'address.postCode': 'Post Code',
      'address.country': 'Country',
      
      // Vehicle
      'vehicle': 'Vehicle Details',
      'vehicle.registrationNumber': 'Registration Number',
      'vehicle.type': 'Vehicle Type',
      'vehicle.make': 'Vehicle Make',
      'vehicle.model': 'Vehicle Model',
      'vehicle.year': 'Vehicle Year',
      'vehicle.capacity': 'Seating Capacity',
      'vehicle.status': 'Vehicle Status',
      
      // Documents
      'documents': 'Driver Documents',
      'documents.DBS': 'DBS Certificate',
      'documents.LICENSE': 'Driver License',
      'documents.TAXI_LICENSE': 'Taxi License',
      'documents.MEDICAL_CERTIFICATE': 'Medical Certificate',
      
      // Vehicle Documents
      'vehicle.documents': 'Vehicle Documents',
      'vehicle.documents.LICENSE': 'Vehicle License',
      'vehicle.documents.INSURANCE': 'Insurance Certificate',
      'vehicle.documents.INSPECTION': 'Vehicle Inspection Certificate',
      'vehicle.documents.MOT': 'MOT Certificate',
      
      // Emergency Contact
      'emergencyContact': 'Emergency Contact',
      'emergencyContact.name': 'Emergency Contact Name',
      'emergencyContact.relationship': 'Emergency Contact Relationship',
      'emergencyContact.phoneNumber': 'Emergency Contact Phone',
      
      // Status
      'status': 'Driver Status',
      'isActive': 'Active Status',
      'lastActive': 'Last Active Date',
      
      // Training
      'trainings': 'Training Records',
      'trainings.training': 'Training Course',
      'trainings.completionDate': 'Training Completion Date',
      'trainings.certificateNumber': 'Training Certificate Number',
      'trainings.expiryDate': 'Training Expiry Date',
      
      // Routes
      'permanentRoutes': 'Permanent Routes',
      'temporaryAssignments': 'Temporary Assignments'
    };

    // If granular training entry like trainings.<id>
    if (field.startsWith('trainings.')) {
      return 'Training Record';
    }

    return fieldMappings[field] || field.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-colors duration-200">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Change History
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          Record of driver and vehicle modifications
        </p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
          {history
            .filter(change => {
              // Skip entries where old and new values are effectively the same
              const oldFormatted = formatValue(change.oldValue, change.field);
              const newFormatted = formatValue(change.newValue, change.field);
              return oldFormatted !== newFormatted;
            })
            .map((change, index) => {
              const Icon = getIcon(change.field);
              return (
                <li key={index} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0 transition-colors duration-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                        Changed {getFieldDisplayName(change.field)}
                      </p>
                      <div className="mt-1 space-y-1">
                        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                          <span className="font-medium">From: </span>
                          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs transition-colors duration-200">
                            {formatValue(change.oldValue, change.field)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                          <span className="font-medium">To: </span>
                          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs transition-colors duration-200">
                            {formatValue(change.newValue, change.field)}
                          </span>
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                        {formatDistanceToNow(new Date(change.updatedAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};