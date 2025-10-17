import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  HomeIcon,
  CalendarIcon,
  SunIcon,
  MoonIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { ThemeContext } from '@context/ThemeContext';
import GlobalSearch from './GlobalSearch';

const Header = ({ toggleSidebar, desktopSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isDark = theme === 'dark';

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 bg-surface dark:bg-surface-dark border-b border-border-light dark:border-border-dark-mode">
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center">
          <button
            type="button"
            className={`mr-4 ${desktopSidebarOpen ? 'lg:hidden' : ''}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6 text-text-tertiary dark:text-text-dark-tertiary" />
          </button>
        </div>

        {/* Global Search Component */}
        <GlobalSearch />

        {/* Right side elements */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-200 
              ${isDark
                ? 'bg-surface-dark-secondary hover:bg-surface-dark-tertiary'
                : 'bg-surface-secondary hover:bg-surface-tertiary'}`}
            aria-label={`Current theme: ${theme} mode. Click to toggle.`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? (
              <MoonIcon className="h-5 w-5 text-secondary-light" />
            ) : (
              <SunIcon className="h-5 w-5 text-accent" />
            )}
          </button>

          {/* Messaging icon */}
          <button
            onClick={() => navigate('/messaging')}
            className={`p-2 rounded-lg transition-colors duration-200 
              ${isActive('/messaging')
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                : 'text-text-secondary dark:text-text-dark-secondary hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary'}`}
            aria-label="WhatsApp Messaging"
            title="WhatsApp Messaging"
          >
            <ChatBubbleLeftRightIcon className={`h-5 w-5 ${isActive('/messaging') ? 'text-primary dark:text-primary-light' : ''}`} />
          </button>

          {/* Invoice icon */}
          <button
            onClick={() => navigate('/drivers/invoice')}
            className={`p-2 rounded-lg transition-colors duration-200 
              ${isActive('/drivers/invoice')
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                : 'text-text-secondary dark:text-text-dark-secondary hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary'}`}
            aria-label="Invoices"
            title="Invoices"
          >
            <DocumentTextIcon className={`h-5 w-5 ${isActive('/drivers/invoice') ? 'text-primary dark:text-primary-light' : ''}`} />
          </button>

          {/* Calendar icon */}
          <button
            onClick={() => navigate('/calendar')}
            className={`p-2 rounded-lg transition-colors duration-200 
              ${isActive('/calendar')
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                : 'text-text-secondary dark:text-text-dark-secondary hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary'}`}
            aria-label="Calendar"
          >
            <CalendarIcon className={`h-5 w-5 ${isActive('/calendar') ? 'text-primary dark:text-primary-light' : ''}`} />
          </button>

          {/* Dashboard icon */}
          <button
            onClick={() => navigate('/')}
            className={`p-2 rounded-lg transition-colors duration-200 
              ${isActive('/')
                ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
                : 'text-text-secondary dark:text-text-dark-secondary hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary'}`}
            aria-label="Dashboard"
          >
            <HomeIcon className={`h-5 w-5 ${isActive('/') ? 'text-primary dark:text-primary-light' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;