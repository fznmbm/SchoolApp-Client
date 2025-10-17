import { NavLink } from 'react-router-dom';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const SidebarItem = ({ 
  item, 
  isExpanded, 
  toggleSection, 
  isSub = false, 
  closeSidebar 
}) => {
  if (item.subItems) {
    return (
      <div>
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
          {isExpanded ? (
            <ChevronDownIcon className="w-5 h-5 ml-auto" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 ml-auto" />
          )}
        </button>
        
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {item.subItems.map(subItem => (
              <SidebarItem
                key={subItem.name}
                item={subItem}
                isSub={true}
                closeSidebar={closeSidebar}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
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

export default SidebarItem;