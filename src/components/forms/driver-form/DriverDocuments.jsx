import React, { useContext } from 'react';
import Input from "@components/common/input/Input";
import FileUpload from "@components/common/input/FileUpload";
import { DOCUMENT_TYPES } from '@utils/driverFormHelpers';
import { ThemeContext } from '@/context/ThemeContext';

const DriverDocuments = ({ initialValues }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="transition-colors duration-200 ease-in-out">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
        Driver Documents
      </h3>
      
      <div className="space-y-6 mt-4">
        {DOCUMENT_TYPES.map((doc, index) => (
          <div
            key={doc.id}
            className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-sm dark:shadow-gray-900/30 mb-4 bg-white dark:bg-gray-800 transition-colors duration-200"
          >
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
              {index + 1}. {doc.name}
            </h4>
            <div className="space-y-4 mt-2">
              {/* Add hidden field for document type */}
              <Input
                type="hidden"
                name={`documents[${index}].type`}
                value={doc.id}
              />
              
              <Input
                label="Document Number"
                name={`documents[${index}].number`}
                type="text"
                placeholder="Enter document number"
                className="mb-2"
              />
              <Input
                label="Issue Date"
                name={`documents[${index}].issuedDate`}
                type="date"
                className="mb-2"
              />
              <Input
                label="Expiry Date"
                name={`documents[${index}].expiryDate`}
                type="date"
                className="mb-2"
              />
              <FileUpload
                label="Upload Document File"
                name={`documents[${index}].file`}
                accept=".pdf,.jpg,.jpeg,.png"
                helperText="Supported formats: PDF, JPG, PNG"
                className="mt-4"
                existingFile={initialValues?.documents?.[index]?.fileUrl}
              />
              {/* Add a description field for the document */}
              {/* <Input
                label="Description (Optional)"
                name={`documents[${index}].description`}
                type="text"
                placeholder="Document description"
                className="mb-2"
              /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverDocuments;