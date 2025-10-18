import { useState, useEffect, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  AcademicCapIcon,
  BriefcaseIcon,
  UserIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { ThemeContext } from '@context/ThemeContext';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';

const RootLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState([]);
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  
  // Close sidebar when URL changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navigation = [
    { 
      name: 'Jobs',
      icon: BriefcaseIcon,
      subItems: [
        { name: 'Daily Jobs', to: '/jobs' },
        { name: 'Route Jobs', to: '/jobs-route' },
        { name: 'Jobs List', to: '/jobs-list' },
        { name: 'Odd Jobs', to: '/odd-jobs' },
      ],
    },

    { name: 'Routes', to: '/routes', icon: MapIcon },
    { 
      name: 'People',
      icon: UserIcon,
      subItems: [
        { name: 'Drivers', to: '/drivers' },
        { name: 'Students', to: '/students' },
        { name: 'Personal Assistants', to: '/pa' },
        { name: 'Admins', to: '/admins' },
        { name: 'Applications', to: '/applications' },
      ],
    },
    {
      name: 'Entities',
      icon: AcademicCapIcon,
      subItems: [
        { name: 'Schools', to: '/schools' },
        { name: 'Vendors', to: '/vendors' },
        { name: 'Trainings', to: '/training' },
        { name: 'Licensing Authorities', to: '/licensing-authority' },
        { name: 'Corporate Accounts', to: '/corporate-accounts' },
      ],
    },
  ];

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setDesktopSidebarOpen(!desktopSidebarOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prevExpanded => 
      prevExpanded.includes(sectionName)
        ? prevExpanded.filter(name => name !== sectionName) // Close the section if it's already open
        : [sectionName] // Open only this section, keeping all others closed
    );
  };

  return (
    <div className="min-h-screen bg-background-primary dark:bg-background-dark-primary transition-colors">
      {/* Sidebar component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        desktopSidebarOpen={desktopSidebarOpen}
        setDesktopSidebarOpen={setDesktopSidebarOpen}
        navigation={navigation}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      />

      {/* Main content */}
      <div className={`transition-all duration-300 ${desktopSidebarOpen ? 'lg:pl-72' : ''}`}>
        <Header 
          toggleSidebar={toggleSidebar} 
          desktopSidebarOpen={desktopSidebarOpen} 
        />

        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;