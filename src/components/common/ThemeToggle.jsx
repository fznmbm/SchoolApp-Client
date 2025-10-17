import { useContext } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { ThemeContext } from '@context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-full focus:outline-none transition-colors duration-200
        ${isDark 
          ? 'bg-surface-dark-secondary hover:bg-surface-dark-tertiary text-text-dark-primary' 
          : 'bg-surface-secondary hover:bg-surface-tertiary text-text-primary'}
        ${className}
      `}
      aria-label={`Current theme: ${theme} mode. Click to toggle.`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <MoonIcon className="h-5 w-5 text-primary-light" />
      ) : (
        <SunIcon className="h-5 w-5 text-accent" />
      )}
    </button>
  );
};

export default ThemeToggle;