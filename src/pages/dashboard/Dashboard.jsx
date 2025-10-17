import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  TruckIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  DocumentTextIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/solid';
import { isAfter, subDays } from 'date-fns';
import StatCard from '@/components/dashboard/StatCard';
import AlertCard from '@/components/dashboard/AlertCard';
import NotificationCard from '@/components/dashboard/NotificationCard';
import { getDashboardStats } from '@services/dashboard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDrivers: 0,
    totalRoutes: 0,
    totalStudents: 0,
    totalPAs: 0,
    activeJobs: 0,
    pendingApplications: 0,
    pendingStaffInvoices: 0,
    newApplications: 0,
    newStaffInvoices: 0
  });
  const [alerts, setAlerts] = useState({
    driverAlerts: [],
    vehicleAlerts: [],
    driverTrainingAlerts: [],
    paAlerts: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardStats();
        setStats(data.stats);
        setAlerts(data.alerts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to sort alerts by severity (based on date)
  const sortAlertsBySeverity = (alerts) => {
    const today = new Date();
    
    return [...alerts].sort((a, b) => {
      const dateA = new Date(a.expiryDate);
      const dateB = new Date(b.expiryDate);
      
      // Define severity levels: 3 = expired, 2 = urgent (within a week), 1 = normal
      const getSeverityLevel = (date) => {
        if (isAfter(today, date)) return 3; // Expired (highest severity)
        if (isAfter(today, subDays(date, 7))) return 2; // Urgent (within a week)
        return 1; // Normal
      };
      
      const severityA = getSeverityLevel(dateA);
      const severityB = getSeverityLevel(dateB);
      
      // Sort by severity level (descending)
      if (severityA !== severityB) {
        return severityB - severityA;
      }
      
      // If same severity, sort by date (ascending)
      return dateA - dateB;
    });
  };

  // Function to fix tense and negative days in descriptions and fix titles
  const fixAlertTense = (alerts) => {
    return alerts.map(alert => {
      const expiryDate = new Date(alert.expiryDate);
      const today = new Date();
      const isExpired = expiryDate < today;
      let newDescription = alert.description;
      let newTitle = alert.title;
      
      // Fix "has expired" to "expired"
      if (isExpired && newDescription.includes('has expired')) {
        newDescription = newDescription.replace('has expired', 'expired');
      }
      
      // Fix negative days - "will expire in -X days" to "expired X days ago"
      const negDaysMatch = newDescription.match(/will expire in -(\d+) days?/);
      if (negDaysMatch) {
        const days = negDaysMatch[1];
        newDescription = newDescription.replace(/will expire in -\d+ days?/, `expired ${days} days ago`);
      }
      
      // Fix title - if expired, make sure title says "Expired" not "Expiring"
      if (isExpired && newTitle.includes('Expiring')) {
        newTitle = newTitle.replace('Expiring', 'Expired');
      }
      
      return {
        ...alert,
        description: newDescription,
        title: newTitle
      };
    });
  };

  // Alert section component to avoid repetition
  const AlertSection = ({ title, alerts, isLoading, icon = <ExclamationTriangleIcon className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" /> }) => {
    // Sort alerts by severity
    const sortedAlerts = sortAlertsBySeverity(alerts);
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/20 border border-gray-100 dark:border-gray-700 p-4 transition-colors duration-200">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
          {icon}
          {title}
        </h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
            </div>
          ) : sortedAlerts.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-gray-500 dark:text-gray-400 italic">No alerts at this time</p>
            </div>
          ) : (
            sortedAlerts.map((alert, index) => (
              <AlertCard 
                key={index}
                title={alert.title}
                description={alert.description}
                type={alert.type}
                date={alert.expiryDate}
                link={alert.link}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  // Combine driver alerts with driver training alerts and fix tense
  const combinedDriverAlerts = fixAlertTense([...alerts.driverAlerts, ...alerts.driverTrainingAlerts]);
  const paAlerts = fixAlertTense(alerts.paAlerts || []);
  const vehicleAlerts = fixAlertTense(alerts.vehicleAlerts || []);

  return (
    <div className="transition-colors duration-200">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatCard 
          title="Total Drivers" 
          value={stats.totalDrivers} 
          icon={<UserGroupIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />} 
          link="/drivers"
        />
        <StatCard 
          title="Total PAs" 
          value={stats.totalPAs} 
          icon={<UserIcon className="h-8 w-8 text-teal-500 dark:text-teal-400" />} 
          link="/pa"
        />
        <StatCard 
          title="Total Routes" 
          value={stats.totalRoutes} 
          icon={<ClipboardDocumentListIcon className="h-8 w-8 text-green-500 dark:text-green-400" />} 
          link="/routes"
        />
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={<AcademicCapIcon className="h-8 w-8 text-purple-500 dark:text-purple-400" />} 
          link="/students"
        />
        <StatCard 
          title="Active Jobs" 
          value={stats.activeJobs} 
          icon={<TruckIcon className="h-8 w-8 text-orange-500 dark:text-orange-400" />} 
          link="/jobs"
        />
      </div>

      {/* Third-Party Submissions Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <NotificationCard 
          title="Staff Applications" 
          count={stats.pendingApplications} 
          newCount={stats.newApplications}
          icon={<DocumentTextIcon className="h-6 w-6" />}
          color="green"
          link="/applications"
        />
        <NotificationCard 
          title="Staff Invoices" 
          count={stats.pendingStaffInvoices} 
          newCount={stats.newStaffInvoices}
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          color="orange"
          link="/drivers/invoice"
        />
      </div>

      {/* Alerts Section - Organized by entity type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Driver Alerts */}
        <AlertSection 
          title="Driver Alerts" 
          alerts={combinedDriverAlerts} 
          isLoading={isLoading}
          icon={<UserGroupIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />}
        />

        {/* PA Alerts */}
        <AlertSection 
          title="PA Alerts" 
          alerts={paAlerts} 
          isLoading={isLoading}
          icon={<UserIcon className="h-5 w-5 text-teal-500 dark:text-teal-400 mr-2" />}
        />

        {/* Vehicle Alerts */}
        <AlertSection 
          title="Vehicle Alerts" 
          alerts={vehicleAlerts} 
          isLoading={isLoading}
          icon={<TruckIcon className="h-5 w-5 text-orange-500 dark:text-orange-400 mr-2" />}
        />
      </div>
    </div>
  );
};

export default Dashboard;