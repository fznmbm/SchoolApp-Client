import React, { useState } from 'react';
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
  BuildingOfficeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Common field names shared across entities
const commonFields = {
  // Basic Info
  'name': 'Name',
  'shortName': 'Short Name',
  'status': 'Status',
  'isActive': 'Active Status',

  // Contact
  'contact.phone': 'Phone Number',
  'contact.email': 'Email Address',
  'contact.contactPerson': 'Contact Person',

  // Address
  'address': 'Full Address',
  'address.street': 'Street Address',
  'address.city': 'City',
  'address.county': 'County',
  'address.postCode': 'Post Code',
  'address.country': 'Country',

  // Documents
  'documents': 'Documents',
  'documents.LICENSE': 'License',
  'documents.INSURANCE': 'Insurance Certificate',
  'documents.INSPECTION': 'Inspection Certificate'
};

// Driver-specific field names
const driverFields = {
  ...commonFields,
  'driverNumber': 'Driver Number',
  'phoneNumber': 'Phone Number',
  'email': 'Email Address',
  'dateOfBirth': 'Date of Birth',
  'nationality': 'Nationality',
  'documents.DBS': 'DBS Certificate',
  'documents.TAXI_LICENSE': 'Taxi License',
  'documents.MEDICAL_CERTIFICATE': 'Medical Certificate',
  
  // Vehicle
  'vehicle': 'Vehicle Details',
  'vehicle.registrationNumber': 'Registration Number',
  'vehicle.type': 'Vehicle Type',
  'vehicle.make': 'Vehicle Make',
  'vehicle.model': 'Vehicle Model',
  'vehicle.year': 'Vehicle Year',
  'vehicle.capacity': 'Seating Capacity',
  'vehicle.status': 'Vehicle Status',
  'vehicle.documents': 'Vehicle Documents',
  'vehicle.documents.LICENSE': 'Vehicle License',
  'vehicle.documents.MOT': 'MOT Certificate',
  
  // Emergency Contact
  'emergencyContact': 'Emergency Contact',
  'emergencyContact.name': 'Emergency Contact Name',
  'emergencyContact.relationship': 'Emergency Contact Relationship',
  'emergencyContact.phoneNumber': 'Emergency Contact Phone',
  
  // Training
  'trainings': 'Training Records',
  'trainings.training': 'Training Course',
  'trainings.completionDate': 'Completion Date',
  'trainings.certificateNumber': 'Certificate Number',
  'trainings.expiryDate': 'Expiry Date',
  
  // Routes
  'permanentRoutes': 'Permanent Routes',
  'temporaryAssignments': 'Temporary Assignments'
};

// Route-specific field names
const routeFields = {
  ...commonFields,
  // Core identifiers
  'routeNo': 'Route Number',
  'poNumber': 'PO Number',
  'paPoNumber': 'PA PO Number',

  // Associations
  'vendor': 'Vendor',
  'permanentDriver': 'Permanent Driver',
  'temporaryDriver': 'Temporary Driver',
  'isPANeeded': 'PA Required',
  'pa': 'Personal Assistant',

  // Planner
  'routePlanner': 'Route Planner',
  'routePlanner.name': 'Planner Name',
  'routePlanner.phone': 'Planner Phone',
  'routePlanner.email': 'Planner Email',

  // Schedule
  'operatingDays': 'Operating Days',
  'dayWiseStudents': 'Day-wise Students',

  // Stops
  'stops': 'Stops',
  'stops.startingStop.location': 'Starting Stop Location',
  'stops.startingStop.timeAM': 'Starting Stop Time AM',
  'stops.startingStop.timePM': 'Starting Stop Time PM',
  'stops.endingStop.location': 'Ending Stop Location',
  'stops.endingStop.timeAM': 'Ending Stop Time AM',
  'stops.endingStop.timePM': 'Ending Stop Time PM',
  'stops.intermediateStops': 'Intermediate Stops',

  // Capacity & Pricing
  'capacity': 'Capacity',
  'dailyMiles': 'Daily Miles',
  'pricePerMile': 'Price per Mile',
  'dailyPrice': 'Daily Price',
  'driverPrice': 'Driver Price',
  'paPrice': 'PA Price',

  // Documents
  'documents': 'Route Documents',
  'documents.status': 'Document Status',

  // Misc
  'description': 'Description',
  'note': 'Note',
  'invoiceTemplate': 'Invoice Template',
};

// School-specific field names
const schoolFields = {
  ...commonFields,
  'schoolNumber': 'School Number',
  'operatingHours': 'Operating Hours',
  'operatingHours.startTime': 'Start Time',
  'operatingHours.endTime': 'End Time',
  'holidays': 'School Holidays',
  'holidays.startDate': 'Holiday Start Date',
  'holidays.endDate': 'Holiday End Date',
  'contact.contactPerson': 'Contact Person',
  'contact.email': 'Email',
  'contact.phone': 'Phone',
  'address.street': 'Street',
  'address.city': 'City',
  'address.county': 'County',
  'address.postCode': 'Post Code',
  'name': 'School Name',
  'status': 'Status',
  'creation': 'School Created'
};

// PA-specific field names
const paFields = {
  ...commonFields,
  'paNumber': 'PA Number',
  'phoneNumber': 'Phone Number',
  'email': 'Email Address',
  'documents.DBS': 'DBS Certificate',
  'trainings': 'Training Records',
  'trainings.training': 'Training Course',
  'trainings.completionDate': 'Completion Date',
  'trainings.certificateNumber': 'Certificate Number',
  'trainings.expiryDate': 'Expiry Date',
  'permanentRoutes': 'Permanent Routes'
};

// Student-specific field names
const studentFields = {
  ...commonFields,
  'studentNumber': 'Student Number',
  'firstName': 'First Name',
  'lastName': 'Last Name',
  'dateOfBirth': 'Date of Birth',
  'gender': 'Gender',
  'school': 'School',
  'grade': 'Grade',
  'class': 'Class',
  'yearGroup': 'Year Group',
  
  // Medical & Special Needs
  'medicalConditions': 'Medical Conditions',
  'medications': 'Medications',
  'allergies': 'Allergies',
  'specialNeeds': 'Special Needs',
  'mobilityAids': 'Mobility Aids',
  'behaviouralNotes': 'Behavioural Notes',
  
  // Parent/Guardian
  'parent': 'Parent/Guardian',
  'parent.name': 'Parent/Guardian Name',
  'parent.relationship': 'Relationship to Student',
  'parent.phone': 'Parent Phone',
  'parent.email': 'Parent Email',
  'parent.address': 'Parent Address',
  
  // Emergency Contact
  'emergencyContact': 'Emergency Contact',
  'emergencyContact.name': 'Emergency Contact Name',
  'emergencyContact.relationship': 'Emergency Contact Relationship',
  'emergencyContact.phone': 'Emergency Contact Phone',
  
  // Transport Requirements
  'pickupAddress': 'Pickup Address',
  'dropoffAddress': 'Drop-off Address',
  'transportNotes': 'Transport Notes',
  'requiresEscort': 'Requires Escort',
  'requiresCarSeat': 'Requires Car Seat',
  'requiresHarness': 'Requires Harness',
  
  // Documents
  'documents': 'Student Documents',
  'documents.MEDICAL': 'Medical Document',
  'documents.CONSENT': 'Consent Form',
  'documents.ASSESSMENT': 'Assessment Document',
  
  // Status
  'attendanceStatus': 'Attendance Status',
  'transportStatus': 'Transport Status',
  
  // Student Document
  'studentDocument': 'Student Document'
};

// Export the field mappings
export const fieldDisplayNames = {
  driver: driverFields,
  school: schoolFields,
  pa: paFields,
  student: studentFields,
  route: routeFields
};

// Format document values
const formatDocumentValue = (value) => {
  if (!value) return 'No document';
  return `${value.name}${value.type ? ` (${value.type})` : ''}${value.description ? ` - ${value.description}` : ''}`;
};

// Format address values
const formatAddressValue = (value) => {
  if (!value) return 'Address: Not provided';
  if (typeof value === 'string') return value;
  const { street, city, county, postCode } = value;
  const addressParts = [street, city, county, postCode].filter(Boolean);
  return addressParts.length > 0 ? addressParts.join(', ') : 'Address: Not provided';
};

// Format parent values
const formatParentValue = (value) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return 'No parent information';
  
  // Handle array of parents
  if (Array.isArray(value)) {
    const formattedParents = [];
    
    // Add primary parent if exists
    if (value[0]) {
      const parent = value[0];
      const relationship = parent.relationship ? parent.relationship.charAt(0).toUpperCase() + parent.relationship.slice(1) : 'Unknown';
      const address = formatAddressValue(parent.address);
      formattedParents.push(`Primary Parent:\n${parent.name || 'Unnamed'} (${relationship})\nWhatsApp: ${parent.whatsapp || 'Not provided'}\nAddress: ${address}`);
    }
    
    // Add secondary parent if exists
    if (value[1]) {
      const parent = value[1];
      const relationship = parent.relationship ? parent.relationship.charAt(0).toUpperCase() + parent.relationship.slice(1) : 'Unknown';
      const address = formatAddressValue(parent.address);
      formattedParents.push(`Secondary Parent:\n${parent.name || 'Unnamed'} (${relationship})\nWhatsApp: ${parent.whatsapp || 'Not provided'}\nAddress: ${address}`);
    }
    
    return formattedParents.join('\n\n');
  }
  
  return 'Invalid parent data';
};

// Format parent values for history comparison (shows only changed parent)
const formatParentValueForHistory = (oldValue, newValue) => {
  if (!oldValue && !newValue) return 'No parent information';
  
  const oldArray = Array.isArray(oldValue) ? oldValue : [];
  const newArray = Array.isArray(newValue) ? newValue : [];
  
  // Find which parent changed
  const changes = [];
  
  // Check primary parent changes
  if (JSON.stringify(oldArray[0]) !== JSON.stringify(newArray[0])) {
    if (!oldArray[0] && newArray[0]) {
      // Show details of the added primary parent
      const newParent = newArray[0];
      const relationship = newParent.relationship ? newParent.relationship.charAt(0).toUpperCase() + newParent.relationship.slice(1) : 'Unknown';
      const address = formatAddressValue(newParent.address);
      changes.push(`Primary parent added: ${newParent.name || 'Unnamed'} (${relationship}), WhatsApp: ${newParent.whatsapp || 'Not provided'}, ${address}`);
    } else if (oldArray[0] && !newArray[0]) {
      // Show details of the removed primary parent
      const oldParent = oldArray[0];
      const relationship = oldParent.relationship ? oldParent.relationship.charAt(0).toUpperCase() + oldParent.relationship.slice(1) : 'Unknown';
      const address = formatAddressValue(oldParent.address);
      changes.push(`Primary parent removed: ${oldParent.name || 'Unnamed'} (${relationship}), WhatsApp: ${oldParent.whatsapp || 'Not provided'}, ${address}`);
    } else {
      // Show specific field changes for primary parent
      const oldParent = oldArray[0];
      const newParent = newArray[0];
      const fieldChanges = [];
      
      if (oldParent.name !== newParent.name) {
        fieldChanges.push(`name: "${oldParent.name || 'Not provided'}" → "${newParent.name || 'Not provided'}"`);
      }
      if (oldParent.relationship !== newParent.relationship) {
        fieldChanges.push(`relationship: "${oldParent.relationship || 'Not provided'}" → "${newParent.relationship || 'Not provided'}"`);
      }
      if (oldParent.whatsapp !== newParent.whatsapp) {
        fieldChanges.push(`WhatsApp: "${oldParent.whatsapp || 'Not provided'}" → "${newParent.whatsapp || 'Not provided'}"`);
      }
      if (JSON.stringify(oldParent.address) !== JSON.stringify(newParent.address)) {
        const oldAddress = formatAddressValue(oldParent.address);
        const newAddress = formatAddressValue(newParent.address);
        fieldChanges.push(`address: "${oldAddress}" → "${newAddress}"`);
      }
      
      if (fieldChanges.length > 0) {
        changes.push(`Primary parent: ${fieldChanges.join(', ')}`);
      } else {
        changes.push('Primary parent updated');
      }
    }
  }
  
  // Check secondary parent changes
  if (JSON.stringify(oldArray[1]) !== JSON.stringify(newArray[1])) {
    if (!oldArray[1] && newArray[1]) {
      // Show details of the added secondary parent
      const newParent = newArray[1];
      const relationship = newParent.relationship ? newParent.relationship.charAt(0).toUpperCase() + newParent.relationship.slice(1) : 'Unknown';
      const address = formatAddressValue(newParent.address);
      changes.push(`Secondary parent added: ${newParent.name || 'Unnamed'} (${relationship}), WhatsApp: ${newParent.whatsapp || 'Not provided'}, ${address}`);
    } else if (oldArray[1] && !newArray[1]) {
      // Show details of the removed secondary parent
      const oldParent = oldArray[1];
      const relationship = oldParent.relationship ? oldParent.relationship.charAt(0).toUpperCase() + oldParent.relationship.slice(1) : 'Unknown';
      const address = formatAddressValue(oldParent.address);
      changes.push(`Secondary parent removed: ${oldParent.name || 'Unnamed'} (${relationship}), WhatsApp: ${oldParent.whatsapp || 'Not provided'}, ${address}`);
    } else {
      // Show specific field changes for secondary parent
      const oldParent = oldArray[1];
      const newParent = newArray[1];
      const fieldChanges = [];
      
      if (oldParent.name !== newParent.name) {
        fieldChanges.push(`name: "${oldParent.name || 'Not provided'}" → "${newParent.name || 'Not provided'}"`);
      }
      if (oldParent.relationship !== newParent.relationship) {
        fieldChanges.push(`relationship: "${oldParent.relationship || 'Not provided'}" → "${newParent.relationship || 'Not provided'}"`);
      }
      if (oldParent.whatsapp !== newParent.whatsapp) {
        fieldChanges.push(`WhatsApp: "${oldParent.whatsapp || 'Not provided'}" → "${newParent.whatsapp || 'Not provided'}"`);
      }
      if (JSON.stringify(oldParent.address) !== JSON.stringify(newParent.address)) {
        const oldAddress = formatAddressValue(oldParent.address);
        const newAddress = formatAddressValue(newParent.address);
        fieldChanges.push(`address: "${oldAddress}" → "${newAddress}"`);
      }
      
      if (fieldChanges.length > 0) {
        changes.push(`Secondary parent: ${fieldChanges.join(', ')}`);
      } else {
        changes.push('Secondary parent updated');
      }
    }
  }
  
  return changes.join(', ');
};

// Format special care needs values
const formatSpecialCareNeedsValue = (value, field) => {
  if (!value) return 'No special care needs';
  
  // Handle single need object (for individual need changes)
  if (!Array.isArray(value) && typeof value === 'object') {
    return `${value.type}: ${value.description}`;
  }
  
  // Handle array of needs
  if (Array.isArray(value)) {
    return value.map((need, index) => 
      `Need ${index + 1}: ${need.type} - ${need.description}`
    ).join('\n');
  }
  
  // Handle individual field changes
  if (field && field.includes('specialCareNeeds.')) {
    // If it's a specific field like specialCareNeeds.0.type
    return value;
  }
  
  return value;
};

// Format relationship values
const formatRelationshipValue = (value) => {
  if (!value) return 'Not specified';
  return value.charAt(0).toUpperCase() + value.slice(1);
};

// Format boolean values
const formatBooleanValue = (value, field) => {
  if (field === 'isActive') {
    return value ? 'Active' : 'Inactive';
  }
  return value ? 'Yes' : 'No';
};

// Centralized empty value messages
export const emptyValueMessages = {
  'email': 'No email address',
  'phone': 'No phone number',
  'dateOfBirth': 'Not provided',
  'vehicle': 'No vehicle assigned',
  'document': 'No document uploaded',
  'address': 'No address provided',
  'emergencyContact': 'No emergency contact',
  'nationality': 'Not specified',
  'default': 'Not provided'
};

// Centralized type mappings
export const typeMappings = {
  vehicleTypes: {
    'SALOON': 'Saloon',
    'ESTATE': 'Estate',
    'MPV': 'MPV',
    'WAV': 'WAV'
  },
  documentTypes: {
    'DBS': 'DBS Certificate',
    'LICENSE': 'License',
    'TAXI_LICENSE': 'Taxi License',
    'MEDICAL_CERTIFICATE': 'Medical Certificate',
    'INSURANCE': 'Insurance Certificate',
    'INSPECTION': 'Inspection Certificate',
    'MOT': 'MOT Certificate',
    'ROUTE_MAP': 'Route Map',
    'CONTRACT': 'Contract',
    'AGREEMENT': 'Agreement',
    'APPROVAL': 'Approval',
    'OTHER': 'Other Document'
  },
  statusTypes: {
    'ACTIVE': 'Active',
    'INACTIVE': 'Inactive',
    'ON_LEAVE': 'On Leave',
    'PENDING': 'Pending',
    'APPROVED': 'Approved',
    'REJECTED': 'Rejected',
    'EXPIRED': 'Expired',
    'EXPIRING_SOON': 'Expiring Soon',
    'VALID': 'Valid'
  }
};

// Icon mapping based on field type
const getIcon = (field) => {
  // Student-specific fields
  if (field === 'studentDocument') return DocumentTextIcon;
  if (field === 'specialCareNeeds') return HeartIcon;
  if (field === 'parents' || field.includes('parent')) return UserGroupIcon;
  // School-specific icons
  if (field === 'school' || field === 'grade' || field === 'name') return AcademicCapIcon;
  if (field.includes('holidays')) return CalendarIcon;
  if (field.includes('operatingHours')) return ClockIcon;
  if (typeof field === 'string' && field.toLowerCase().includes('special service')) return CalendarIcon;
  if (field.includes('stop') || field.includes('location')) return MapPinIcon;
  if (field.includes('vehicle')) return TruckIcon;
  if (field.toLowerCase().includes('document') || field.includes('certificate')) return DocumentIcon;
  if (field.includes('license')) return IdentificationIcon;
  if (field.includes('address')) return MapPinIcon;
  if (field.includes('phone')) return PhoneIcon;
  if (field.includes('email')) return EnvelopeIcon;
  if (field.includes('status')) return CheckCircleIcon;
  if (field.includes('time') || field.includes('date')) return ClockIcon;
  if (field.includes('school')) return BuildingOfficeIcon;
  if (field.includes('training')) return AcademicCapIcon;
  if (field.includes('route') || field.includes('assignment')) return BriefcaseIcon;
  if (field.includes('holiday')) return CalendarIcon;
  return UserIcon;
};

export const HistoryTracker = ({ 
  history, 
  title = 'Change History', 
  subtitle = 'Record of modifications',
  entityType = 'driver', // can be 'driver', 'school', or 'pa'
  trainingNames = {}, // mapping of training IDs to names
  idToNameMap = {}, // optional map of ObjectId -> human-readable name for associations
  defaultCollapsed = true,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(Boolean(defaultCollapsed));
  // Utilities to group related route changes (driver+price, pa+price)
  const areTimesClose = (t1, t2, toleranceMs = 5000) => {
    if (!t1 || !t2) return false;
    const a = new Date(t1).getTime();
    const b = new Date(t2).getTime();
    if (Number.isNaN(a) || Number.isNaN(b)) return String(t1) === String(t2);
    return Math.abs(a - b) <= toleranceMs;
  };

  const groupRouteHistory = (items) => {
    if (!Array.isArray(items)) return [];
    const result = [];
    const used = new Array(items.length).fill(false);
    const counterpartMap = {
      permanentDriver: 'driverPrice',
      driverPrice: 'permanentDriver',
      pa: 'paPrice',
      paPrice: 'pa',
    };

    for (let i = 0; i < items.length; i += 1) {
      if (used[i]) continue;
      const a = items[i];
      const counterpartField = counterpartMap[a.field];
      if (counterpartField) {
        const j = items.findIndex((b, idx) => !used[idx] && idx !== i && b.field === counterpartField && areTimesClose(a.updatedAt, b.updatedAt));
        if (j !== -1) {
          const b = items[j];
          const isPA = a.field === 'pa' || a.field === 'paPrice' || b.field === 'pa' || b.field === 'paPrice';
          result.push({
            _combined: isPA ? 'pa' : 'driver',
            updatedAt: new Date(a.updatedAt) > new Date(b.updatedAt) ? a.updatedAt : b.updatedAt,
            oldPrimary: (a.field === 'permanentDriver' || a.field === 'pa') ? a.oldValue : b.oldValue,
            newPrimary: (a.field === 'permanentDriver' || a.field === 'pa') ? a.newValue : b.newValue,
            oldPrice: (a.field === 'driverPrice' || a.field === 'paPrice') ? a.oldValue : b.oldValue,
            newPrice: (a.field === 'driverPrice' || a.field === 'paPrice') ? a.newValue : b.newValue,
          });
          used[i] = true;
          used[j] = true;
          continue;
        }
      }
      result.push(a);
    }
    return result;
  };

  // Value formatter
  const formatValue = (value, field) => {
  // Handle special formatters
  if (field === 'studentDocument') {
    return formatDocumentValue(value);
  }
  // Route associations formatting for readability (case-insensitive match)
  if (field && (
    field.toLowerCase().includes('driver') ||
    field.toLowerCase().includes('pa') ||
    field.toLowerCase().includes('vendor')
  )) {
    if (value && typeof value === 'object') {
      if (value.name) return value.name;
      if (value.firstName || value.lastName) {
        const first = value.firstName || '';
        const last = value.lastName || '';
        const full = `${first} ${last}`.trim();
        return full || 'Not provided';
      }
      if (value._id && idToNameMap[value._id]) return idToNameMap[value._id];
    }
    // If it's an ObjectId string, try to map to a name
    if (typeof value === 'string') {
      if (idToNameMap[value]) return idToNameMap[value];
      // Heuristic: if looks like ObjectId, prefer 'Not provided' message rather than showing raw id when we can
      if (/^[a-f\d]{24}$/i.test(value)) return value; // fallback to id if no mapping
    }
  }
  if (field === 'parents') {
    // For parent field, we need to handle the comparison differently
    return formatParentValue(value);
  }
  if (field.startsWith('parents.')) {
    return formatParentValue(value, field);
  }
  if (field === 'specialCareNeeds' || field.startsWith('specialCareNeeds.')) {
    return formatSpecialCareNeedsValue(value, field);
  }
  if (field === 'relationship' || field.endsWith('.relationship')) {
    return formatRelationshipValue(value);
  }
  if (field.includes('address') || field.endsWith('.address')) {
    return formatAddressValue(value);
  }
  if (field === 'grade') {
    return value || 'Not specified';
  }
  // Route temporary driver object formatting
  if (field && field.includes('temporaryDriver')) {
    if (!value) return 'Not provided';
    if (typeof value === 'object') {
      // Resolve driver name from object or mapping
      let driverName = 'Not provided';
      const driverVal = value.driver || value.driverId || value.driverName;
      if (driverVal) {
        if (typeof driverVal === 'object') {
          driverName = driverVal.name || (driverVal.firstName || '' ? `${driverVal.firstName || ''} ${driverVal.lastName || ''}`.trim() : '') || (driverVal._id && idToNameMap[driverVal._id]) || 'Not provided';
        } else if (typeof driverVal === 'string') {
          driverName = idToNameMap[driverVal] || (/^[a-f\d]{24}$/i.test(driverVal) ? driverVal : driverVal);
        }
      }

      const formatDateSafe = (d) => {
        if (!d) return undefined;
        const date = new Date(d);
        return isNaN(date.getTime()) ? undefined : format(date, 'dd MMM yyyy');
      };

      const start = formatDateSafe(value.startDate);
      const end = formatDateSafe(value.endDate);
      const timeMap = { MORNING: 'AM', EVENING: 'PM', BOTH: 'Both' };
      const time = value.timeOfDay ? (timeMap[value.timeOfDay] || value.timeOfDay) : undefined;
      const price = (value.price !== undefined && value.price !== null) ? `€${value.price}` : undefined;

      const parts = [];
      if (driverName) parts.push(driverName);
      if (start || end) parts.push(`${start || '—'} → ${end || '—'}`);
      if (time) parts.push(time);
      if (price) parts.push(price);

      return parts.length ? parts.join(' - ') : 'Not provided';
    }
    // If it's a string, try mapping to a name
    if (typeof value === 'string' && idToNameMap[value]) return idToNameMap[value];
  }
  // Handle school holidays
  if (field === 'holidays') {
    if (!Array.isArray(value) || value.length === 0) return 'No holidays';
    return value.map(holiday => {
      const startDate = new Date(holiday.startDate);
      const endDate = new Date(holiday.endDate);
      const startFormatted = !isNaN(startDate.getTime()) ? format(startDate, 'dd MMM yyyy') : holiday.startDate;
      const endFormatted = !isNaN(endDate.getTime()) ? format(endDate, 'dd MMM yyyy') : holiday.endDate;
      return `${startFormatted} - ${endFormatted}`;
    }).join(', ');
  }
  // Handle operating hours
  if (field.includes('operatingHours')) {
    if (!value) return 'Not set';
    if (typeof value === 'object') {
      return `${value.startTime || 'Not set'} - ${value.endTime || 'Not set'}`;
    }
    return value;
  }
  if (typeof value === 'boolean' || field === 'isActive') {
    return formatBooleanValue(value, field);
  }
  if (value === undefined || value === null || value === '') {
    // Handle empty values
    for (const [key, message] of Object.entries(emptyValueMessages)) {
      if (field.includes(key)) return message;
    }
    return emptyValueMessages.default;
  }

  // Handle document changes - includes singular 'Document Added/Removed'
  if (field.toLowerCase().includes('document')) {
    if (typeof value === 'object') {
      const docInfo = [];
      const type = value.type || value.documentType;
      const fileName = value.fileName || value.name || value.originalname;
      const description = value.description;
      const mappedType = type ? (typeMappings.documentTypes[type] || type) : undefined;
      if (fileName) docInfo.push(fileName);
      // Only include type label when it's informative (skip generic/"Route Map") and place after filename
      if (mappedType && type !== 'ROUTE_MAP' && type !== 'OTHER') docInfo.push(`(${mappedType})`);
      if (description) docInfo.push(description);
      // issued/expiry dates if present
      if (value.issuedDate && value.issuedDate !== 'Not provided') {
        const d = new Date(value.issuedDate);
        docInfo.push(`issued ${!isNaN(d.getTime()) ? format(d, 'dd MMM yyyy') : value.issuedDate}`);
      }
      if (value.expiryDate && value.expiryDate !== 'Not provided') {
        const d = new Date(value.expiryDate);
        docInfo.push(`expires ${!isNaN(d.getTime()) ? format(d, 'dd MMM yyyy') : value.expiryDate}`);
      }
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
        vehicleInfo.push(`(${typeMappings.vehicleTypes[value.type] || value.type})`);
      }
      if (value.capacity) vehicleInfo.push(`${value.capacity} seats`);
      return vehicleInfo.join(' ') || 'No vehicle details';
    }
    return String(value);
  }

  // Handle address changes
  if (field.includes('address') && typeof value === 'object') {
    return [value.street, value.city, value.county, value.postCode]
      .filter(Boolean)
      .join(', ') || 'No address details';
  }

  // Handle dates only for explicit date/time fields
  const isDateField = (fld) => {
    if (!fld || typeof fld !== 'string') return false;
    const f = fld.toLowerCase();
    return (
      f.includes('date') ||
      f.includes('time') ||
      f.includes('uploadedat') ||
      f.includes('updatedat') ||
      f.includes('createdat') ||
      f.includes('assignedat')
    );
  };

  if (
    isDateField(field) &&
    (value instanceof Date || (typeof value === 'string' && value !== 'Not provided' && !isNaN(Date.parse(value))))
  ) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return format(date, 'dd MMM yyyy');
    }
  }

  // Handle status
  if (field.includes('status')) {
    return typeMappings.statusTypes[value] || value.replace(/_/g, ' ').toLowerCase();
  }

  // Handle emergency contact changes
  if (field.includes('emergencyContact') && typeof value === 'object') {
    const contactInfo = [];
    if (value.name) contactInfo.push(value.name);
    if (value.relationship) contactInfo.push(`(${value.relationship})`);
    if (value.phoneNumber) contactInfo.push(value.phoneNumber);
    return contactInfo.join(' ') || 'No contact details';
  }

  // Handle training changes
  if (field.includes('trainings') && typeof value === 'object') {
    const trainingInfo = [];
    
    // Handle training name (could be ObjectId or name object)
    if (value.name) {
      if (typeof value.name === 'object') {
        trainingInfo.push(value.name.trainingName || 'Unknown Training');
      } else {
        // If it's just an ID, try to map it to a name
                                const trainingName = trainingNames[value.name] || trainingNames[value._id] || value.name;
        trainingInfo.push(trainingName);
      }
    }
    
    if (value.certificateNumber) trainingInfo.push(`Certificate Number: ${value.certificateNumber}`);
    
    if (value.completionDate && value.completionDate !== 'Not provided') {
      const date = new Date(value.completionDate);
      if (!isNaN(date.getTime())) {
        trainingInfo.push(`completed ${format(date, 'dd MMM yyyy')}`);
      } else {
        trainingInfo.push(`completed ${value.completionDate}`);
      }
    }
    
    if (value.expiryDate && value.expiryDate !== 'Not provided') {
      const date = new Date(value.expiryDate);
      if (!isNaN(date.getTime())) {
        trainingInfo.push(`expires ${format(date, 'dd MMM yyyy')}`);
      } else {
        trainingInfo.push(`expires ${value.expiryDate}`);
      }
    }
    
    if (value.status) {
      trainingInfo.push(typeMappings.statusTypes[value.status] || value.status);
    }
    
    // Handle certificate information
    if (value.certificate) {
      trainingInfo.push(`Certificate: ${value.certificate.fileName}`);
    }
    
    return trainingInfo.join(' - ') || 'No training details';
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

// Training name mapping is now handled by the trainingNames prop

  // Render the component
  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-colors duration-200">
      <div className="px-4 py-5 sm:px-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
            {subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(v => !v)}
          className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-expanded={!isCollapsed}
          aria-controls="history-content"
        >
          {isCollapsed ? (
            <>
              <ChevronRightIcon className="w-4 h-4" />
              Show
            </>
          ) : (
            <>
              <ChevronDownIcon className="w-4 h-4" />
              Hide
            </>
          )}
        </button>
      </div>
      {!isCollapsed && (
      <div id="history-content" className="border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
          {(
            entityType === 'route'
              ? groupRouteHistory(history)
              : Array.isArray(history)
                ? [...history].sort((a, b) => {
                    const at = (v) => v && (v.updatedAt || v.createdAt) ? new Date(v.updatedAt || v.createdAt).getTime() : 0;
                    return at(b) - at(a); // newest first
                  })
                : []
            )
              .filter(change => {
               // Hide temporary assignment records in driver history
               if (entityType === 'driver' && change.field && change.field.toLowerCase().includes('temporary')) {
                 return false;
               }
                // Always keep route special service entries; we'll render them with custom comparator
                if (
                  entityType === 'route' &&
                  typeof change.field === 'string' &&
                  change.field.toLowerCase().startsWith('special service')
                ) {
                  return true;
                }
                // Always keep stop and day-wise student entries (we custom-render them)
                if (
                  entityType === 'route' &&
                  typeof change.field === 'string'
                ) {
                  const f = change.field.toLowerCase();
                  if (f.includes('stop') || f.startsWith('day-wise student')) return true;
                }
                // Suppress auto stop sequence updates that occur alongside a stop add/remove in the same update moment
                if (
                  entityType === 'route' &&
                  change.field === 'Stop Sequence Updated' &&
                  Array.isArray(history)
                ) {
                  const changeTs = change.updatedAt ? new Date(change.updatedAt).getTime() : 0;
                  const coincident = history.some(h => {
                    if (!h || !h.field || !h.updatedAt) return false;
                    const hf = String(h.field).toLowerCase();
                    if (!(hf.includes('stop added') || hf.includes('stop removed'))) return false;
                    const ts = new Date(h.updatedAt).getTime();
                    return Math.abs(ts - changeTs) <= 2000; // within 2 seconds of add/remove
                  });
                  if (coincident) return false;
                }
               if (change._combined === 'driver' || change._combined === 'pa') {
                 const primaryField = change._combined === 'driver' ? 'permanentDriver' : 'pa';
                 const oldPrimary = formatValue(change.oldPrimary, primaryField);
                 const newPrimary = formatValue(change.newPrimary, primaryField);
                 const oldPrice = change.oldPrice ?? 'Not provided';
                 const newPrice = change.newPrice ?? 'Not provided';
                 return oldPrimary !== newPrimary || String(oldPrice) !== String(newPrice);
               }
               // Skip entries where old and new values are effectively the same
               if (change.field === 'parents') {
                 // Special handling for parents to show only changed parent
                 const oldArray = Array.isArray(change.oldValue) ? change.oldValue : [];
                 const newArray = Array.isArray(change.newValue) ? change.newValue : [];
                 return JSON.stringify(oldArray) !== JSON.stringify(newArray);
               }
               const oldFormatted = formatValue(change.oldValue, change.field);
               const newFormatted = formatValue(change.newValue, change.field);
               return oldFormatted !== newFormatted;
             })
                                          .filter(change => change.field !== 'trainings.fileUpload' && change.field !== 'trainings.fileProcessed' && change.field !== 'trainings.file')
               .map((change, index) => {
                 if (change._combined === 'driver' || change._combined === 'pa') {
                   const isPA = change._combined === 'pa';
                   const primaryField = isPA ? 'pa' : 'permanentDriver';
                   const titleText = isPA ? 'Personal Assistant' : 'Permanent Driver';
                   const Icon = BriefcaseIcon;
                   return (
                     <li key={index} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                       <div className="flex items-start space-x-3">
                         <div className="flex-shrink-0">
                           <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Changed {titleText}</p>
                           <div className="mt-1 space-y-1">
                             <div className="text-sm text-gray-500 dark:text-gray-400">
                               <span className="font-medium">From: </span>
                               <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{`${formatValue(change.oldPrimary, primaryField)} - ${change.oldPrice !== undefined && change.oldPrice !== null ? `€${change.oldPrice}` : 'Not provided'}`}</span>
                             </div>
                             <div className="text-sm text-gray-500 dark:text-gray-400">
                               <span className="font-medium">To: </span>
                               <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{`${formatValue(change.newPrimary, primaryField)} - ${change.newPrice !== undefined && change.newPrice !== null ? `€${change.newPrice}` : 'Not provided'}`}</span>
                             </div>
                           </div>
                           <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{formatDistanceToNow(new Date(change.updatedAt), { addSuffix: true })}</p>
                         </div>
                       </div>
                     </li>
                   );
                 }
                // Temporary driver combined record support
                if (entityType === 'route' && change.field === 'temporaryDriver') {
                  const Icon = UserIcon;
                  return (
                    <li key={index} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Changed Temporary Driver</p>
                          <div className="mt-1 space-y-1">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium">From: </span>
                              <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{formatValue(change.oldValue, 'temporaryDriver')}</span>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium">To: </span>
                              <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{formatValue(change.newValue, 'temporaryDriver')}</span>
                            </div>
                          </div>
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{formatDistanceToNow(new Date(change.updatedAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                    </li>
                  );
                }
                if (entityType === 'route' && typeof change.field === 'string' && change.field.toLowerCase().startsWith('special service')) {
                  const Icon = CalendarIcon;
                  const studentName = (() => {
                    const sid = change.student && (change.student._id || change.student);
                    // Try to resolve from idToNameMap, else fall back to string
                    if (sid && idToNameMap[String(sid)]) return idToNameMap[String(sid)];
                    if (typeof change.student === 'object') {
                      const first = change.student.firstName || '';
                      const last = change.student.lastName || '';
                      const full = `${first} ${last}`.trim();
                      if (full) return full;
                    }
                    return null;
                  })();
                  const formatService = (svc) => {
                    if (!svc || typeof svc !== 'object') return 'Not provided';
                    const parts = [];
                    if (studentName) parts.push(studentName);
                    if (svc.dayOfWeek) parts.push(svc.dayOfWeek);
                    if (svc.serviceType) parts.push(svc.serviceType.replace(/_/g, ' ').toLowerCase());
                    if (svc.specialTime) parts.push(`@ ${svc.specialTime}`);
                    if (svc.additionalCharge !== undefined && svc.additionalCharge !== null) parts.push(`€${svc.additionalCharge}`);
                    if (svc.notes) parts.push(svc.notes);
                    return parts.join(' - ') || 'Not provided';
                  };
                  const isRemoved = typeof change.field === 'string' && change.field.toLowerCase().includes('removed');
                  return (
                    <li key={index} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{change.field}</p>
                          <div className="mt-1 space-y-1">
                            {isRemoved ? (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium">Removed: </span>
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{formatService(change.oldValue)}</span>
                              </div>
                            ) : (
                              <>
                                {change.oldValue !== undefined && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">From: </span>
                                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{formatService(change.oldValue)}</span>
                                  </div>
                                )}
                                {change.newValue !== undefined && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">To: </span>
                                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{formatService(change.newValue)}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{formatDistanceToNow(new Date(change.updatedAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                    </li>
                  );
                }
                // Route stop-related rendering (stop add/remove/updates, student membership at stops)
                if (
                  entityType === 'route' &&
                  typeof change.field === 'string' &&
                  (
                    change.field.toLowerCase().includes('stop') ||
                    (change.field.toLowerCase().includes('student') && change.field.toLowerCase().includes('stop')) ||
                    change.field.toLowerCase().startsWith('day-wise student')
                  )
                ) {
                  const Icon = change.field.toLowerCase().startsWith('day-wise student') ? CalendarIcon : MapPinIcon;
                  const formatStopValue = (val) => {
                    if (!val || typeof val !== 'object') return 'Not provided';
                    const parts = [];
                    if (val.stopType) parts.push(`${val.stopType} stop`);
                    if (val.location) parts.push(`@ ${val.location}`);
                    if (typeof val.sequence === 'number') parts.push(`#${val.sequence}`);
                    if (val.timeAM) parts.push(`AM ${val.timeAM}`);
                    if (val.timePM) parts.push(`PM ${val.timePM}`);
                    if (val.isSchool !== undefined) parts.push(val.isSchool ? 'School' : 'Non-school');
                    return parts.join(' - ') || 'Not provided';
                  };
                  const resolveStudentName = () => {
                    const sid = change.student && (change.student._id || change.student);
                    if (!sid) return change.studentName || null;
                    const key = String(sid);
                    return idToNameMap[key] || change.studentName || null;
                  };
                  const studentName = resolveStudentName();
                  const isDaywise = typeof change.field === 'string' && change.field.toLowerCase().startsWith('day-wise student');
                  const isRemovalOnly = change.newValue === null || change.newValue === undefined;
                  const isAdditionOnly = change.oldValue === null || change.oldValue === undefined;
                  const capitalize = (s) => (typeof s === 'string' && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s);
                  if (isDaywise) {
                    const day = isRemovalOnly ? change.oldValue?.day : change.newValue?.day;
                    const action = isRemovalOnly ? 'Removed' : 'Added';
                    return (
                      <li key={index} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Student Schedule Updated</p>
                            <div className="mt-1 space-y-1">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">
                                  {`${studentName || 'Student'} - ${action.toLowerCase()} - ${capitalize(day) || 'Unknown day'}`}
                                </span>
                              </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{formatDistanceToNow(new Date(change.updatedAt), { addSuffix: true })}</p>
                          </div>
                        </div>
                      </li>
                    );
                  }
                  // Default stop-related rendering
                  return (
                    <li key={index} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {change.field}
                          </p>
                          <div className="mt-1 space-y-1">
                            {studentName && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">
                                  {`${studentName} - ${isRemovalOnly ? 'removed' : (isAdditionOnly ? 'added' : 'moved')}`}
                                </span>
                              </div>
                            )}
                            {!isAdditionOnly && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium">From: </span>
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{formatStopValue(change.oldValue)}</span>
                              </div>
                            )}
                            {!isRemovalOnly && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium">To: </span>
                                <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">{formatStopValue(change.newValue)}</span>
                              </div>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{formatDistanceToNow(new Date(change.updatedAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                    </li>
                  );
                }
                 const Icon = getIcon(change.field);
                 // Handle training fields with MongoDB ObjectIds
                 let fieldName = fieldDisplayNames[entityType]?.[change.field];
 
                                if (!fieldName && change.field.startsWith('trainings.')) {
                  // Extract the actual field name after the ObjectId
                  const parts = change.field.split('.');
                  if (parts.length > 2) {
                    // If it's a sub-field like trainings.<id>.completionDate
                    const fieldKey = `trainings.${parts[2]}`;
                    fieldName = fieldDisplayNames[entityType]?.[fieldKey] ||
                      parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
                  } else {
                    // If it's just trainings.<id> or trainings.new
                    const trainingId = parts[1];
                    if (trainingId === 'new') {
                      fieldName = 'New Training Added';
                    } else {
                      const trainingName = trainingNames[trainingId] || 'Training Record';
                      fieldName = `${trainingName} Training`;
                    }
                  }
                } else if (!fieldName) {
                   // Default field name formatting
                   fieldName = change.field.split('.').map(part =>
                     part.charAt(0).toUpperCase() + part.slice(1)
                   ).join(' ');
                 }
                 
                 // For training fields, use generic "Training" heading (will be prefixed with "Changed" later)
                 if (change.field.startsWith('trainings.')) {
                   if (change.field === 'trainings.new') {
                     fieldName = 'New Training Added';
                     // Don't prefix with "Changed" for new trainings
                     return (
                       <li key={index} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                         <div className="flex items-start space-x-3">
                           <div className="flex-shrink-0">
                             <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                               {fieldName}
                             </p>
                             <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                               <div className="flex items-center space-x-2">
                                 <span className="text-gray-400 dark:text-gray-500">To:</span>
                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                   {formatValue(change.newValue, change.field)}
                                 </span>
                               </div>
                             </div>
                             <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                               {formatDistanceToNow(new Date(change.updatedAt), { addSuffix: true })}
                             </p>
                           </div>
                         </div>
                       </li>
                     );
                   } else if (change.newValue === null) {
                     // This is a training removal
                     fieldName = 'Training Removed';
                     return (
                       <li key={index} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                         <div className="flex items-start space-x-3">
                           <div className="flex-shrink-0">
                             <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                               {fieldName}
                             </p>
                             <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                               <div className="flex items-center space-x-2">
                                 <span className="text-gray-400 dark:text-gray-500">Removed:</span>
                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                   {formatValue(change.oldValue, change.field)}
                                 </span>
                               </div>
                             </div>
                             <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                               {formatDistanceToNow(new Date(change.updatedAt), { addSuffix: true })}
                             </p>
                           </div>
                         </div>
                       </li>
                     );
                   } else {
                     fieldName = 'Training';
                   }
                 }
                 
                 // Filter out generic file upload entries that don't have specific training IDs
                 if (change.field === 'trainings.fileUpload' || change.field === 'trainings.fileProcessed' || change.field === 'trainings.file') {
                   return null; // Skip these generic entries
                 }

              return (
                <li key={index} className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex items-start space-x-3">
                    <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0 transition-colors duration-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
                        Changed {fieldName}
                      </p>
                                             <div className="mt-1 space-y-1">
                        {change.field === 'holidays' && change.schoolName && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            <span className="font-medium">School: </span>
                            <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs transition-colors duration-200">
                              {change.schoolName}
                            </span>
                          </div>
                        )}
                         {change.field === 'parents' ? (
                           <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                             <span className="font-medium">Change: </span>
                             <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs transition-colors duration-200">
                               {formatParentValueForHistory(change.oldValue, change.newValue)}
                             </span>
                           </div>
                         ) : (
                           <>
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
                           </>
                         )}
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
      )}
    </div>
  );
};