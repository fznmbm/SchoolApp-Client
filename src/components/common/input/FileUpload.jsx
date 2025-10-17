import React, { useRef, useState, useCallback, useContext } from 'react';
import { useField } from 'formik';
import { Transition } from '@headlessui/react';
import { 
  DocumentIcon, 
  XMarkIcon,
  ExclamationCircleIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext } from '@context/ThemeContext';

const FilePreview = ({ file, preview, onRemove }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const fileName = file.fileName || file.name || '';
  const fileType = file.fileMimeType || file.type || '';
  const fileSize = file.fileSize || file.size || 0;
  
  // Don't show preview if there's no meaningful file data
  if (!fileName && fileSize === 0) {
    return null;
  }
  
  const isImage = typeof fileType === 'string' && 
                 (fileType.startsWith('image/') || 
                  /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(fileName));

  return (
    <Transition
      show={true}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <div className={`flex items-center justify-between p-4 rounded-lg shadow-sm
                      ${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors duration-200`}>
        <div className="flex items-center space-x-4">
          {isImage && preview ? (
            <div className="relative h-16 w-16 rounded-lg overflow-hidden">
              <img 
                src={preview || file.url || file.fileUrl} 
                alt="Preview" 
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className={`flex items-center justify-center h-16 w-16 rounded-lg
                            ${isDark ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-200`}>
              <DocumentIcon className={`h-8 w-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
          )}
          <div>
            <p className={`text-sm font-medium truncate max-w-[200px]
                         ${isDark ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-200`}>
              {fileName}
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
              {(fileSize / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className={`p-2 rounded-full transition-colors duration-200
                      ${isDark 
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                      }`}
          aria-label="Remove file"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </Transition>
  );
};

const DropZone = ({ isDragging, children }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <Transition
      show={true}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={`
          relative rounded-lg
          ${isDragging 
            ? `border-2 border-dashed ${isDark ? 'border-blue-400 bg-blue-900/10' : 'border-blue-500 bg-blue-50'}` 
            : `border-2 border-dashed ${isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`
          }
          transition-colors duration-200
        `}
        aria-label={isDragging ? 'Drop files here' : 'Drag and drop area'}
        role="button"
      >
        {children}
      </div>
    </Transition>
  );
};

const FileUpload = ({ 
  label, 
  name, 
  accept = "*/*", 
  maxSize = 10485760, // 10MB default
  helperText,
  required,
  disabled,
  ...props 
}) => {
  const [field, meta, helpers] = useField(name);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = useCallback((file) => {
    if (!file) return { isValid: false, error: 'No file selected' };

    // Check file size
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)} MB` 
      };
    }

    // Check file type
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map(type => type.trim());
      const fileType = file.type;
      if (!acceptedTypes.some(type => 
        fileType.match(type.replace("*", ".*")) || 
        file.name.endsWith(type.replace("*", ""))
      )) {
        return { 
          isValid: false, 
          error: `File type must be ${accept}` 
        };
      }
    }

    return { isValid: true };
  }, [accept, maxSize]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file = e.dataTransfer.files[0];
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      helpers.setError(validation.error);
      return;
    }

    handleFileChange(file);
  }, [helpers, validateFile, disabled]);

  const handleFileChange = useCallback((file) => {
    if (!file) return;

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    helpers.setValue(file);
    helpers.setTouched(true);
  }, [helpers]);

  const handleRemove = useCallback(() => {
    helpers.setValue('');
    helpers.setTouched(true);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [helpers]);

  const isError = meta.error && meta.touched;

  return (
    <div className={`space-y-2 ${disabled ? 'opacity-60' : ''}`}>
      {/* Label */}
      <div className="flex items-baseline justify-between">
        <label 
          htmlFor={name} 
          className={`block text-sm font-medium ${isDark ? 'text-gray-100' : 'text-gray-900'} transition-colors duration-200`}
        >
          {label}
          {required && <span className="ml-1 text-red-500 dark:text-red-400">*</span>}
        </label>
        {helperText && (
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
            {helperText}
          </span>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDragEnter={!disabled ? handleDragIn : undefined}
        onDragOver={!disabled ? handleDrag : undefined}
        onDragLeave={!disabled ? handleDragOut : undefined}
        onDrop={!disabled ? handleDrop : undefined}
        className={`
          focus-within:outline-none 
          ${isError
            ? 'focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 dark:focus-within:ring-red-400'
            : 'focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:focus-within:ring-blue-400'}
          dark:focus-within:ring-offset-gray-800
          transition-all duration-200
          ${disabled ? 'cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={name}
          accept={accept}
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            if (disabled) return;
            
            const file = e.target.files?.[0];
            const validation = validateFile(file);
            
            if (!validation.isValid) {
              helpers.setError(validation.error);
              return;
            }

            handleFileChange(file);
          }}
          aria-invalid={isError ? 'true' : 'false'}
          aria-describedby={`${name}-error-message`}
          {...props}
        />

        {field.value ? (
          (() => {
            const previewComponent = (
              <FilePreview 
                file={field.value} 
                preview={preview} 
                onRemove={!disabled ? handleRemove : undefined} 
              />
            );
            return previewComponent || (
              <DropZone isDragging={isDragging}>
                <div 
                  className={`p-8 text-center ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  onClick={() => !disabled && fileInputRef.current?.click()}
                  tabIndex={disabled ? -1 : 0}
                  onKeyDown={(e) => {
                    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  role="button"
                  aria-disabled={disabled}
                >
                  <ArrowUpTrayIcon className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`} />
                  <div className="mt-4 flex flex-col items-center">
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
                      {!disabled && (
                        <>
                          <span className={`font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} transition-colors duration-200`}>
                            Click to upload
                          </span>
                          {" "}or drag and drop
                        </>
                      )}
                      {disabled && "File upload disabled"}
                    </p>
                    <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                      {accept !== "*/*" ? `Allowed files: ${accept}` : "Any file type allowed"}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                      Max size: {(maxSize / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              </DropZone>
            );
          })()
        ) : (
          <DropZone isDragging={isDragging}>
            <div 
              className={`p-8 text-center ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={() => !disabled && fileInputRef.current?.click()}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              role="button"
              aria-disabled={disabled}
            >
              <ArrowUpTrayIcon className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`} />
              <div className="mt-4 flex flex-col items-center">
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-200`}>
                  {!disabled && (
                    <>
                      <span className={`font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} transition-colors duration-200`}>
                        Click to upload
                      </span>
                      {" "}or drag and drop
                    </>
                  )}
                  {disabled && "File upload disabled"}
                </p>
                <p className={`mt-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                  {accept !== "*/*" ? `Allowed files: ${accept}` : "Any file type allowed"}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                  Max size: {(maxSize / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
          </DropZone>
        )}
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center space-x-2 ${isDark ? 'text-red-400' : 'text-red-500'} transition-colors duration-200`}
            id={`${name}-error-message`}
            aria-live="polite"
          >
            <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{meta.error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;