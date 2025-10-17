import React, { useCallback, useContext } from 'react';
import { useField, useFormikContext } from 'formik';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';
import { ThemeContext } from '@context/ThemeContext';

export default function Select({ 
  label, 
  options = [], 
  placeholder = 'Select...',
  showCheckIcon = true,
  required,
  helperText,
  ...props 
}) {
  const [field, meta] = useField(props);
  const { setFieldValue, setFieldTouched, validateForm } = useFormikContext();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  const selectedOption = options.find(option => option.id === field.value) || null;
  
  const handleChange = useCallback(async (option) => {
    const newValue = option?.id || '';
    await setFieldValue(field.name, newValue);
    await setFieldTouched(field.name, true);
    await validateForm(); // Trigger immediate form validation
  }, [field.name, setFieldValue, setFieldTouched, validateForm]);

  const hasError = meta.touched && meta.error;
  const fieldId = props.id || `select-${field.name}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={fieldId}
          className="block text-sm font-medium mb-1.5 text-text-primary dark:text-text-dark-primary transition-colors duration-200"
        >
          {label}
          {required && <span className="ml-1 text-error dark:text-error-light">*</span>}
        </label>
      )}

      <Listbox
        value={selectedOption}
        onChange={handleChange}
        disabled={props.disabled}
        {...props}
      >
        <div className="relative">
          <Listbox.Button
            id={fieldId}
            className={`
              relative w-full cursor-pointer rounded-lg 
              bg-surface dark:bg-surface-dark-secondary
              px-3.5 py-2.5 text-left shadow-sm
              border transition-all duration-200
              ${hasError 
                ? 'border-error dark:border-error-light text-error dark:text-error-light' 
                : 'border-border-light dark:border-border-dark-mode text-text-primary dark:text-text-dark-primary hover:border-border-dark dark:hover:border-border-light'
              }
              focus:outline-none focus:ring-2 
              ${hasError 
                ? 'focus:border-error focus:ring-error/50 dark:focus:border-error-light dark:focus:ring-error-light/50' 
                : 'focus:border-primary focus:ring-primary/50 dark:focus:border-primary-light dark:focus:ring-primary-light/50'
              }
              disabled:bg-surface-secondary dark:disabled:bg-surface-dark-tertiary 
              disabled:text-text-tertiary dark:disabled:text-text-dark-tertiary 
              disabled:cursor-not-allowed
              sm:text-sm
            `}
            aria-expanded="false"
            aria-haspopup="listbox"
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={
              hasError 
                ? `${field.name}-error` 
                : helperText 
                  ? `${field.name}-helper` 
                  : undefined
            }
          >
            <span className={`block truncate ${!selectedOption ? 'text-text-tertiary dark:text-text-dark-tertiary' : ''} transition-colors duration-200`}>
              {selectedOption ? selectedOption.name : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {hasError ? (
                <ExclamationCircleIcon className="h-5 w-5 text-error dark:text-error-light transition-colors duration-200" aria-hidden="true" />
              ) : (
                <ChevronUpDownIcon className="h-5 w-5 text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200" aria-hidden="true" />
              )}
            </span>
          </Listbox.Button>

          <Listbox.Options
            className={`
              absolute z-10 mt-1 max-h-60 w-full overflow-auto 
              rounded-lg bg-surface dark:bg-surface-dark py-1 text-base shadow-lg 
              ring-1 ring-border-light dark:ring-border-dark-mode ring-opacity-5 focus:outline-none 
              transition-colors duration-200
              sm:text-sm
            `}
          >
            {options.map((option) => (
              <Listbox.Option
                key={option.id}
                value={option}
                className={({ active }) => `
                  relative cursor-pointer select-none py-2.5
                  ${showCheckIcon ? 'pl-10' : 'pl-4'} pr-4
                  ${active 
                    ? 'bg-primary/10 dark:bg-primary-dark/20 text-primary dark:text-primary-light' 
                    : 'text-text-primary dark:text-text-dark-primary'
                  }
                  transition-colors duration-200
                  ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={option.disabled}
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                      {option.name}
                    </span>
                    {showCheckIcon && selected && (
                      <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                        active 
                          ? 'text-primary dark:text-primary-light' 
                          : 'text-primary dark:text-primary-light'
                      } transition-colors duration-200`}>
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      {hasError ? (
        <p 
          className="mt-2 text-sm text-error dark:text-error-light transition-colors duration-200" 
          id={`${field.name}-error`}
          aria-live="polite"
        >
          {meta.error}
        </p>
      ) : helperText ? (
        <p 
          className="mt-2 text-sm text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200" 
          id={`${field.name}-helper`}
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  placeholder: PropTypes.string,
  showCheckIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
};

Select.defaultProps = {
  options: [],
  placeholder: 'Select...',
  showCheckIcon: true,
  disabled: false,
  required: false,
};