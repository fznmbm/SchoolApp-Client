import { useContext } from 'react';
import { ThemeContext } from '@context/ThemeContext';
import SidebarContent from './SidebarContent';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  desktopSidebarOpen,
  setDesktopSidebarOpen,
  navigation,
  expandedSections,
  toggleSection
}) => {
  const { theme } = useContext(ThemeContext);
  
  const closeMobileSidebar = () => setSidebarOpen(false);
  const closeDesktopSidebar = () => setDesktopSidebarOpen(false);

  return (
    <>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        {/* Backdrop overlay */}
        <div 
          className="fixed inset-0 bg-text-primary/30 dark:bg-background-dark/80 transition-colors" 
          onClick={closeMobileSidebar} 
        />
        
        {/* Sidebar panel */}
        <div className="fixed top-0 left-0 bottom-0 flex flex-col w-72 transition-transform">
          <SidebarContent
            navigation={navigation}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            closeSidebar={closeMobileSidebar}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      {desktopSidebarOpen && (
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 transition-all duration-300">
          <SidebarContent
            navigation={navigation}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            closeSidebar={closeDesktopSidebar}
          />
        </div>
      )}
    </>
  );
};

export default Sidebar;