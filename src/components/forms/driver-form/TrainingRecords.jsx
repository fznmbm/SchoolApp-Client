import React, { useContext } from 'react';
import { FieldArray } from "formik";
import Input from "@components/common/input/Input";
import Select from "@components/common/input/Select";
import FileUpload from "@components/common/input/FileUpload";
import { ThemeContext } from '@/context/ThemeContext';

const TrainingRecords = ({ trainingsOptions }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="transition-colors duration-200 ease-in-out">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
        Training Records
      </h3>
      
      <FieldArray name="trainings">
        {({ push, remove, form }) => (
          <div className="space-y-4">
            {form.values.trainings.map((training, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 p-4 rounded-md shadow-sm dark:shadow-gray-900/30 bg-white dark:bg-gray-800 transition-colors duration-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-200">
                    Training Record {index + 1}
                  </h4>
                  {form.values.trainings.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                      aria-label={`Remove training record ${index + 1}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-2">Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
                  <Select
                    label="Training"
                    name={`trainings.${index}.training`}
                    options={trainingsOptions}
                    placeholder="Select Training"
                  />
                  <Input
                    label="Certificate Number"
                    name={`trainings.${index}.certificateNumber`}
                    type="text"
                    placeholder="Enter certificate number"
                  />
                  <Input
                    label="Completion Date"
                    name={`trainings.${index}.completionDate`}
                    type="date"
                  />
                  <Input
                    label="Expiry Date"
                    name={`trainings.${index}.expiryDate`}
                    type="date"
                  />
                </div>
                <FileUpload
                  label="Training Certificate"
                  name={`trainings.${index}.file`}
                  accept=".pdf,.jpg,.jpeg,.png"
                  helperText="Upload training certificate"
                  existingFile={training.documentUrl}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                push({
                  training: "",
                  completionDate: "",
                  certificateNumber: "",
                  expiryDate: "",
                  documentUrl: "",
                  file: null,
                })
              }
              className="flex items-center mt-4 px-4 py-2 border border-gray-300 dark:border-gray-600 
                        rounded-md text-sm text-gray-700 dark:text-gray-300 
                        bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 
                        transition-colors duration-200"
              aria-label="Add another training record"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Another Training
            </button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default TrainingRecords;