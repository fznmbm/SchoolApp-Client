import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '@context/ThemeContext';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  className,
  ...props
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const baseClass = 'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200';
  
  const focusClass = 'focus:outline-none focus:ring-2 dark:focus:ring-offset-background-dark-primary';
  
  const variants = {
    primary: 'bg-primary text-text-inverse hover:bg-primary-dark focus:ring-primary-light dark:bg-primary-dark dark:hover:bg-primary',
    
    secondary: 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary focus:ring-border-dark dark:bg-surface-dark-secondary dark:text-text-dark-secondary dark:hover:bg-surface-dark-tertiary dark:focus:ring-border-light',
    
    outline: 'border border-border-light bg-surface text-text-primary hover:bg-surface-secondary focus:ring-primary-light dark:border-border-dark-mode dark:bg-surface-dark dark:text-text-dark-primary dark:hover:bg-surface-dark-secondary',
    
    danger: 'bg-error text-text-inverse hover:bg-error-dark focus:ring-error-light dark:bg-error-dark dark:hover:bg-error',
    
    success: 'bg-success text-text-inverse hover:bg-success-dark focus:ring-success-light dark:bg-success-dark dark:hover:bg-success',
    
    info: 'bg-info text-text-inverse hover:bg-info-dark focus:ring-info-light dark:bg-info-dark dark:hover:bg-info',
    
    warning: 'bg-warning text-text-inverse hover:bg-warning-dark focus:ring-warning-light dark:bg-warning-dark dark:hover:bg-warning',
    
    dark: 'bg-text-primary text-text-inverse hover:bg-text-secondary focus:ring-text-light dark:bg-text-dark-secondary dark:hover:bg-text-dark-primary',
    
    light: 'bg-surface-secondary text-text-primary hover:bg-surface-tertiary focus:ring-border dark:bg-surface-dark-tertiary dark:text-text-dark-primary dark:hover:bg-surface-dark-secondary',
    
    link: 'text-primary hover:text-primary-dark hover:underline focus:ring-primary-light bg-transparent dark:text-primary-light dark:hover:text-primary'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledClass = disabled ? 
    'opacity-50 cursor-not-allowed pointer-events-none' : 
    '';

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${baseClass}
        ${variants[variant]}
        ${sizes[size]}
        ${focusClass}
        ${disabledClass}
        ${className || ''}
      `}
      disabled={disabled}
      aria-disabled={disabled}
      type={props.type || 'button'} 
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;