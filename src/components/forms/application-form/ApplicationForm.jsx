import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleInput from './SimpleInput';
import SimpleDatePicker from './SimpleDatePicker';
import SimpleFileUpload from './SimpleFileUpload';
import Button from '../../common/Button';

const ApplicationForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    position: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    currentAddress: '',
    previousAddress: '',
    nationalInsuranceNumber: '',
    nationality: '',
    hasUKDrivingLicense: false,
    requiresWorkPermit: false,
    workPermitDetails: {
      permitNumber: '',
      document: null
    },
    hasConvictions: false,
    convictionDetails: '',
    dbsInfo: {
      name: '',
      dateOfBirth: '',
      certificateNumber: '',
      updateServiceId: '',
      isRegisteredWithUpdateService: false
    },
    references: [
      {
        name: '',
        address: '',
        phone: '',
        relationship: '',
        email: ''
      },
      {
        name: '',
        address: '',
        phone: '',
        relationship: '',
        email: ''
      }
    ],
    declaration: {
      agreedToTerms: false,
      fullName: '',
      date: new Date()
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Clear error for this field when user starts typing/selecting
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Handle nested object properties (e.g., "workPermitDetails.permitNumber")
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      if (type === 'checkbox') {
        setFormData(prev => ({
          ...prev,
          [parentKey]: {
            ...prev[parentKey],
            [childKey]: checked
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [parentKey]: {
            ...prev[parentKey],
            [childKey]: value
          }
        }));
      }
    } else {
      // Handle regular properties
      if (type === 'checkbox') {
        setFormData(prev => ({
          ...prev,
          [name]: checked
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const handleDBSInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If unchecking the Update Service registration, clear all DBS fields
    if (name === 'isRegisteredWithUpdateService' && !checked) {
      setFormData(prev => ({
        ...prev,
        dbsInfo: {
          ...prev.dbsInfo,
          isRegisteredWithUpdateService: false,
          name: '',
          dateOfBirth: '',
          certificateNumber: '',
          updateServiceId: ''
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dbsInfo: {
          ...prev.dbsInfo,
          [name]: type === 'checkbox' ? checked : value
        }
      }));
    }
  };

  const handleReferenceChange = (index, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [name]: value } : ref
      )
    }));
  };

  const scrollToError = (errorField) => {
    // Small delay to ensure error message is rendered
    setTimeout(() => {
      const section = document.querySelector(`[data-section="${errorField}"]`);
      if (section) {
        section.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Clear previous errors
    setErrors({});
    
    try {
      // Validate required fields
      const newErrors = {};
      
      // Validate position
      if (!formData.position) {
        newErrors.position = 'Please select a position';
      }
      
      // Validate DBS fields only if user is registered with Update Service
      if (formData.dbsInfo.isRegisteredWithUpdateService) {
        if (!formData.dbsInfo.name || !formData.dbsInfo.dateOfBirth || !formData.dbsInfo.certificateNumber) {
          throw new Error('Please fill in all required DBS information fields');
        }
      }
      
      // If there are validation errors, set them and return
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        
        // Scroll to the first error field
        const firstErrorField = Object.keys(newErrors)[0];
        scrollToError(firstErrorField);
        return;
      }
      
      const formDataToSend = new FormData();
      
      // Append all text data
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      });

      // Append file if exists
      if (formData.workPermitDetails.document) {
        formDataToSend.append('documents', formData.workPermitDetails.document);
      }

      const response = await fetch('http://localhost:5000/applications/submit', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      await response.json();
      setShowSuccess(true);
      setFormData({
        position: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        currentAddress: '',
        previousAddress: '',
        nationalInsuranceNumber: '',
        nationality: '',
        hasUKDrivingLicense: false,
        requiresWorkPermit: false,
        workPermitDetails: {
          permitNumber: '',
          document: null
        },
        hasConvictions: false,
        convictionDetails: '',
        dbsInfo: {
          name: '',
          dateOfBirth: '',
          certificateNumber: '',
          updateServiceId: '',
          isRegisteredWithUpdateService: false
        },
        references: [
          {
            name: '',
            address: '',
            phone: '',
            relationship: '',
            email: ''
          },
          {
            name: '',
            address: '',
            phone: '',
            relationship: '',
            email: ''
          }
        ],
        declaration: {
          agreedToTerms: false,
          fullName: '',
          date: new Date()
        }
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting application:', error);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showError && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Failed to submit application. Please try again.</span>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Application submitted successfully!</span>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">Crown Cars Application Form</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
                 {/* Position Selection */}
         <div className="space-y-4" data-section="position">
           <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">
             Position <span className="text-red-500">*</span>
           </h2>
           <div className="flex gap-6">
             <label className="flex items-center cursor-pointer">
               <input
                 type="radio"
                 name="position"
                 value="Driver"
                 checked={formData.position === 'Driver'}
                 onChange={handleInputChange}
                 className={`mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2 ${
                   errors.position ? 'border-red-500' : ''
                 }`}
               />
               <span className="text-gray-200">Driver</span>
             </label>
             <label className="flex items-center cursor-pointer">
               <input
                 type="radio"
                 name="position"
                 value="PA"
                 checked={formData.position === 'PA'}
                 onChange={handleInputChange}
                 className={`mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2 ${
                   errors.position ? 'border-red-500' : ''
                 }`}
               />
               <span className="text-gray-200">PA</span>
             </label>
           </div>
           {errors.position && (
             <p className="text-red-500 text-sm mt-1">{errors.position}</p>
           )}
        </div>

                 {/* Personal Information */}
         <div className="space-y-4">
           <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">Personal Information</h2>
          <SimpleInput
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          <SimpleInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <SimpleInput
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
          <SimpleInput
            label="Current Address"
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleInputChange}
            required
          />
          <SimpleInput
            label="Previous Address (if at current address for less than 5 years)"
            name="previousAddress"
            value={formData.previousAddress}
            onChange={handleInputChange}
          />
          <SimpleInput
            label="National Insurance Number"
            name="nationalInsuranceNumber"
            value={formData.nationalInsuranceNumber}
            onChange={handleInputChange}
            required
          />
          <SimpleInput
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            required
          />
        </div>

                 {/* Work Eligibility */}
         <div className="space-y-4">
           <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">Work Eligibility</h2>
                     <label className="flex items-center cursor-pointer">
             <input
               type="checkbox"
               name="hasUKDrivingLicense"
               checked={formData.hasUKDrivingLicense}
               onChange={handleInputChange}
               className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
             />
             <span className="text-gray-200">Do you hold a full current UK driving license?</span>
           </label>
           <label className="flex items-center cursor-pointer">
             <input
               type="checkbox"
               name="requiresWorkPermit"
               checked={formData.requiresWorkPermit}
               onChange={handleInputChange}
               className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
             />
             <span className="text-gray-200">Do you require a permit to work in the UK?</span>
           </label>
          
          {formData.requiresWorkPermit && (
            <div className="ml-6 space-y-4">
                             <SimpleInput
                 label="Work Permit Number"
                 name="workPermitDetails.permitNumber"
                 value={formData.workPermitDetails.permitNumber}
                 onChange={handleInputChange}
                 required
               />
               <SimpleFileUpload
                 label="Upload Work Permit Document"
                 name="workPermitDetails.document"
                 onChange={(file) => setFormData(prev => ({
                   ...prev,
                   workPermitDetails: {
                     ...prev.workPermitDetails,
                     document: file
                   }
                 }))}
                 required
               />
            </div>
          )}
                 </div>

         {/* Conviction Information */}
         <div className="space-y-4">
           <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">Conviction Information</h2>
           <label className="flex items-center cursor-pointer">
             <input
               type="checkbox"
               name="hasConvictions"
               checked={formData.hasConvictions}
               onChange={handleInputChange}
               className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
             />
             <span className="text-gray-200">Do you have any convictions?</span>
           </label>
           
           {formData.hasConvictions && (
             <div className="ml-6 space-y-4">
               <SimpleInput
                 label="Conviction Details"
                 name="convictionDetails"
                 value={formData.convictionDetails}
                 onChange={handleInputChange}
                 placeholder="Please provide details of your convictions"
                 required
               />
             </div>
           )}
         </div>

         {/* DBS Information */}
         <div className="space-y-4">
           <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">DBS Information</h2>
           
           {/* DBS Update Service Question - Asked First */}
           <label className="flex items-center cursor-pointer">
             <input
               type="checkbox"
               name="isRegisteredWithUpdateService"
               checked={formData.dbsInfo.isRegisteredWithUpdateService}
               onChange={handleDBSInfoChange}
               className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
             />
             <span className="text-gray-200">Are you registered with the DBS Update Service?</span>
           </label>

           {/* DBS Information Fields - Only shown if registered with Update Service */}
           {formData.dbsInfo.isRegisteredWithUpdateService && (
             <div className="ml-6 space-y-4">
               <SimpleInput
                 label="Name (as it appears on DBS Certificate)"
                 name="name"
                 value={formData.dbsInfo.name}
                 onChange={handleDBSInfoChange}
                 required
               />
               <SimpleDatePicker
                 label="Date of Birth"
                 name="dateOfBirth"
                 value={formData.dbsInfo.dateOfBirth}
                 onChange={(date) => setFormData(prev => ({
                   ...prev,
                   dbsInfo: {
                     ...prev.dbsInfo,
                     dateOfBirth: date
                   }
                 }))}
                 required
               />
               <SimpleInput
                 label="DBS Certificate Number"
                 name="certificateNumber"
                 value={formData.dbsInfo.certificateNumber}
                 onChange={handleDBSInfoChange}
                 required
               />
               <SimpleInput
                 label="DBS Update Service ID"
                 name="updateServiceId"
                 value={formData.dbsInfo.updateServiceId}
                 onChange={handleDBSInfoChange}
               />
             </div>
           )}
        </div>

                 {/* References */}
         <div className="space-y-4">
           <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">References</h2>
          {formData.references.map((reference, index) => (
                         <div key={index} className="border border-gray-600 bg-gray-700 p-6 rounded-lg space-y-4">
               <h3 className="font-semibold text-white text-lg">Reference {index + 1}</h3>
                             <SimpleInput
                 label="Name"
                 name="name"
                 value={reference.name}
                 onChange={(e) => handleReferenceChange(index, e)}
                 required
               />
               <SimpleInput
                 label="Address"
                 name="address"
                 value={reference.address}
                 onChange={(e) => handleReferenceChange(index, e)}
                 required
               />
               <SimpleInput
                 label="Phone"
                 name="phone"
                 value={reference.phone}
                 onChange={(e) => handleReferenceChange(index, e)}
                 required
               />
               <SimpleInput
                 label="Relationship to Applicant"
                 name="relationship"
                 value={reference.relationship}
                 onChange={(e) => handleReferenceChange(index, e)}
                 required
               />
               <SimpleInput
                 label="Email"
                 type="email"
                 name="email"
                 value={reference.email}
                 onChange={(e) => handleReferenceChange(index, e)}
               />
            </div>
          ))}
        </div>

                 {/* Declaration */}
         <div className="space-y-4">
           <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-2">Declaration</h2>
                     <div className="bg-gray-700 border border-gray-600 p-6 rounded-lg">
             <p className="text-sm text-gray-200 leading-relaxed">
               I declare that the information provided in this application is true and complete
               to the best of my knowledge. I understand that any false statements or omissions
               may result in rejection of my application or dismissal if employed. I authorize
               Crown Cars to verify all information provided and conduct relevant background checks.
             </p>
           </div>
           <label className="flex items-center cursor-pointer">
             <input
               type="checkbox"
               name="declaration.agreedToTerms"
               checked={formData.declaration.agreedToTerms}
               onChange={(e) => setFormData(prev => ({
                 ...prev,
                 declaration: {
                   ...prev.declaration,
                   agreedToTerms: e.target.checked
                 }
               }))}
               className="mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
               required
             />
             <span className="text-gray-200">I agree to the above declaration</span>
           </label>
                     <SimpleInput
             label="Full Name"
             name="declaration.fullName"
             value={formData.declaration.fullName}
             onChange={(e) => setFormData(prev => ({
               ...prev,
               declaration: {
                 ...prev.declaration,
                 fullName: e.target.value
               }
             }))}
             required
           />
           <SimpleDatePicker
             label="Date"
             name="declaration.date"
             value={formData.declaration.date}
             onChange={(date) => setFormData(prev => ({
               ...prev,
               declaration: {
                 ...prev.declaration,
                 date
               }
             }))}
             required
           />
        </div>

                 <div className="flex justify-end pt-6">
           <Button 
             type="submit" 
             disabled={!formData.declaration.agreedToTerms || isSubmitting}
             className={`
               bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg 
               transition-all duration-200 
               disabled:bg-gray-600 disabled:cursor-not-allowed
               flex items-center space-x-2
               min-w-[200px] justify-center
             `}
           >
             {isSubmitting ? (
               <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <span>Submitting...</span>
               </>
             ) : (
               <span>Submit Application</span>
             )}
           </Button>
         </div>
       </form>
         </div>
       </div>
     </div>
   );
 };

export default ApplicationForm;
