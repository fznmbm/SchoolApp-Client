import React, { useContext, useState } from 'react';
import { useField } from 'formik';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ThemeContext } from '@context/ThemeContext';

export default function Input({
  label,
  multiline = false,
  required,
  helperText,
  ...props
}) {
  const [field, meta] = useField(props);
  const Component = multiline ? 'textarea' : 'input';
  const hasError = meta.touched && meta.error;
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = props.type === 'password';

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const effectiveType = isPassword
    ? (showPassword ? 'text' : 'password')
    : props.type;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {label && (
          <motion.label
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            htmlFor={props.id || props.name}
            className="block text-sm font-medium mb-1.5 text-text-primary dark:text-text-dark-primary transition-colors duration-200"
          >
            {label}
            {required && <span className="ml-1 text-error dark:text-error-light">*</span>}
          </motion.label>
        )}
      </AnimatePresence>

      <div className="relative rounded-lg shadow-sm">
        <motion.div
          initial={false}
          animate={hasError ? "error" : "normal"}
          variants={{
            error: {
              scale: [1, 1.02, 1],
              transition: {
                duration: 0.2
              }
            },
            normal: {
              scale: 1
            }
          }}
        >
          <Component
            {...field}
            {...props}
            type={effectiveType}
            className={`
              block w-full rounded-lg px-3.5 py-2.5
              text-text-primary dark:text-text-dark-primary text-sm
              bg-surface dark:bg-surface-dark-secondary
              border transition-all duration-200
              placeholder:text-text-tertiary dark:placeholder:text-text-dark-tertiary
              shadow-sm
              focus:outline-none focus:ring-2 focus:ring-offset-0
              ${hasError
                ? 'border-error dark:border-error-light focus:border-error focus:ring-error/50 dark:focus:border-error-light dark:focus:ring-error-light/50'
                : 'border-border-light dark:border-border-dark-mode focus:border-primary dark:focus:border-primary-light focus:ring-primary/50 dark:focus:ring-primary-light/50 hover:border-border-dark dark:hover:border-border-light'
              }
              ${props.className || ''}
              ${isPassword && hasError ? 'pr-20' : (hasError || isPassword) ? 'pr-10' : ''}
              disabled:bg-surface-secondary dark:disabled:bg-surface-dark-tertiary 
              disabled:text-text-tertiary dark:disabled:text-text-dark-tertiary 
              disabled:cursor-not-allowed
              disabled:border-border-light dark:disabled:border-border-dark-mode
            `}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={
              hasError
                ? `${props.name}-error`
                : helperText
                  ? `${props.name}-helper`
                  : undefined
            }
            required={required}
          />
        </motion.div>

        <AnimatePresence>
          {isPassword && (
            <motion.button
              type="button"
              onClick={togglePasswordVisibility}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className={`absolute inset-y-0 right-0 flex items-center ${hasError ? 'pr-10' : 'pr-3'} text-text-tertiary dark:text-text-dark-tertiary hover:text-text-secondary dark:hover:text-text-dark-secondary focus:outline-none transition-colors duration-200`}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Error icon */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <ExclamationCircleIcon className="h-5 w-5 text-error dark:text-error-light transition-colors duration-200" aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {hasError ? (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="mt-2 text-sm text-error dark:text-error-light transition-colors duration-200"
            id={`${props.name}-error`}
            aria-live="polite"
          >
            {meta.error}
          </motion.p>
        ) : helperText ? (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="mt-2 text-sm text-text-tertiary dark:text-text-dark-tertiary transition-colors duration-200"
            id={`${props.name}-helper`}
          >
            {helperText}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}