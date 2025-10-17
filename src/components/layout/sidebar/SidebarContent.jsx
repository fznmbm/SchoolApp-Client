import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  XMarkIcon, 
  ArrowRightOnRectangleIcon, 
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { ThemeContext } from '@context/ThemeContext';
import useAuth from '@hooks/useAuth';
import Popup from '@components/common/modal/Popup';

const SidebarContent = ({ 
  navigation, 
  expandedSections, 
  toggleSection, 
  closeSidebar 
}) => {
  const { theme } = useContext(ThemeContext);
  const { logout } = useAuth();
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  
  const handleLogoutClick = () => {
    setIsLogoutPopupOpen(true);
  };

  const handleConfirmedLogout = () => {
    logout();
    setIsLogoutPopupOpen(false);
  };
  
  const renderNavItem = (item, isSub = false) => {
    if (item.subItems) {
      return (
        <div key={item.name}>
          <button
            className={`
              flex items-center w-full px-4 py-3 text-base font-medium rounded-lg
              text-text-secondary dark:text-text-dark-secondary 
              hover:bg-background-secondary dark:hover:bg-background-dark-secondary
              transition-colors
              ${isSub ? 'pl-11' : ''}
            `}
            onClick={() => toggleSection(item.name)}
          >
            {item.icon && <item.icon className="w-5 h-5 mr-3" />}
            {item.name}
            {expandedSections.includes(item.name) ? (
              <ChevronDownIcon className="w-5 h-5 ml-auto" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 ml-auto" />
            )}
          </button>
          
          {expandedSections.includes(item.name) && (
            <div className="mt-1 space-y-1">
              {item.subItems.map(subItem => renderNavItem(subItem, true))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.name}
        to={item.to}
        className={({ isActive }) => `
          flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors
          ${isActive
            ? 'bg-primary text-text-inverse dark:bg-primary-dark dark:text-text-inverse'
            : 'text-text-secondary dark:text-text-dark-secondary hover:bg-background-secondary dark:hover:bg-background-dark-secondary'
          }
          ${isSub ? 'pl-11' : ''}
        `}
        onClick={closeSidebar}
      >
        {item.icon && <item.icon className="w-5 h-5 mr-3" />}
        {item.name}
      </NavLink>
    );
  };

  return (
    <>
      <nav className="flex-1 flex flex-col bg-surface dark:bg-surface-dark p-6 border-r border-border-light dark:border-border-dark-mode">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-primary dark:text-primary-light">SchoolRoute</h2>
          <button 
            onClick={closeSidebar}
            className="text-text-tertiary dark:text-text-dark-tertiary hover:text-text-secondary dark:hover:text-text-dark-secondary transition-colors"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 space-y-1">
          {navigation.map(item => renderNavItem(item))}
        </div>

        {/* Expandable Settings */}
        <div>
          <button
            className="flex items-center w-full px-4 py-3 text-base font-medium rounded-lg text-text-secondary dark:text-text-dark-secondary hover:bg-background-secondary dark:hover:bg-background-dark-secondary transition-colors"
            onClick={() => toggleSection('Settings')}
          >
            <Cog6ToothIcon className="w-5 h-5 mr-3" />
            Settings
            {expandedSections.includes('Settings') ? (
              <ChevronDownIcon className="w-5 h-5 ml-auto" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 ml-auto" />
            )}
          </button>

          {expandedSections.includes('Settings') && (
            <div className="mt-1 space-y-1">
              <NavLink
                to="/company"
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors pl-11
                  ${isActive
                    ? 'bg-primary text-text-inverse dark:bg-primary-dark dark:text-text-inverse'
                    : 'text-text-secondary dark:text-text-dark-secondary hover:bg-background-secondary dark:hover:bg-background-dark-secondary'
                  }
                `}
                onClick={closeSidebar}
              >
                Company
              </NavLink>

              <NavLink
                to="/settings/job-display"
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors pl-11
                  ${isActive
                    ? 'bg-primary text-text-inverse dark:bg-primary-dark dark:text-text-inverse'
                    : 'text-text-secondary dark:text-text-dark-secondary hover:bg-background-secondary dark:hover:bg-background-dark-secondary'
                  }
                `}
                onClick={closeSidebar}
              >
                Job Display
              </NavLink>
            </div>
          )}
        </div>

        {/* Logout button */}
        <button 
          className="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors
                     text-error dark:text-error-light hover:bg-background-secondary dark:hover:bg-background-dark-secondary"
          onClick={handleLogoutClick}
          aria-label="Logout"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
      </nav>

      {/* Logout confirmation popup */}
      <Popup
        isOpen={isLogoutPopupOpen}
        onClose={() => setIsLogoutPopupOpen(false)}
        onConfirm={handleConfirmedLogout}
        message="Are you sure you want to log out of the system? Any unsaved changes will be lost."
        title="Confirm Logout"
        confirmText="Logout"
        confirmButtonProps={{
          variant: "danger",
          className: "bg-red-600 hover:bg-red-700 transition-colors duration-200"
        }}
      />
    </>
  );
};

export default SidebarContent;