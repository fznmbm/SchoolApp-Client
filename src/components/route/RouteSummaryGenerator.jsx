import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  DocumentTextIcon, 
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Button from '@components/common/Button';
import { getDrivers } from '@services/drivers';
import { getSchool } from '@services/school';


const RouteSummaryGenerator = ({ route }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState('');
  const [schoolCache, setSchoolCache] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [driversWithPhone, setDriversWithPhone] = useState([]);
  const [isDriversLoading, setIsDriversLoading] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [customPhone, setCustomPhone] = useState('');

  // Prefetch all school data that might be needed for this route
  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!route) return;
      
      // Find all unique school IDs in the route
      const schoolIds = new Set();
      
      // Check starting stop
      if (route.stops.startingStop?.isSchool && route.stops.startingStop?.schoolId) {
        schoolIds.add(route.stops.startingStop.schoolId);
      }
      
      // Check intermediate stops
      if (route.stops.intermediateStops && route.stops.intermediateStops.length > 0) {
        route.stops.intermediateStops.forEach(stop => {
          if (stop.isSchool && stop.schoolId) {
            schoolIds.add(stop.schoolId);
          }
        });
      }
      
      // Check ending stop
      if (route.stops.endingStop?.isSchool && route.stops.endingStop?.schoolId) {
        schoolIds.add(route.stops.endingStop.schoolId);
      }
      
      // Also check students' schools
      const checkStudentsSchools = (students) => {
        if (!students) return;
        students.forEach(studentEntry => {
          if (studentEntry.student?.school) {
            schoolIds.add(studentEntry.student.school);
          }
        });
      };
      
      // Check students at all stops
      if (route.stops.startingStop?.students) {
        checkStudentsSchools(route.stops.startingStop.students);
      }
      if (route.stops.intermediateStops) {
        route.stops.intermediateStops.forEach(stop => {
          if (stop.students) {
            checkStudentsSchools(stop.students);
          }
        });
      }
      if (route.stops.endingStop?.students) {
        checkStudentsSchools(route.stops.endingStop.students);
      }
      
      // Fetch data for all unique school IDs
      if (schoolIds.size > 0) {
        setIsLoading(true);
        const schoolsCache = {};
        
        try {
          // Fetch school data in parallel
          const schoolPromises = Array.from(schoolIds).map(id => getSchool(id));
          const schoolsData = await Promise.all(schoolPromises);
          
          // Build a cache of school data
          schoolsData.forEach(school => {
            if (school && school._id) {
              schoolsCache[school._id] = school;
            }
          });
          
          setSchoolCache(schoolsCache);
        } catch (error) {
          console.error('Error fetching school data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchSchoolData();
  }, [route]);

  // Generate text summary from route data
  const generateRouteSummary = () => {
    if (!route) return '';

    // Format operating days with proper capitalization
    const formatDay = (day) => day.charAt(0).toUpperCase() + day.slice(1);
    const operatingDays = route.operatingDays
      .map(formatDay)
      .join(', ');

    // Format time for better readability
    const formatTime = (time) => {
      if (!time) return 'N/A';
      const [hours, minutes] = time.split(':');
      const paddedHours = hours.padStart(2, '0');
      return `${paddedHours}:${minutes}`;
    };

    // Get stop information
    const { startingStop, intermediateStops = [], endingStop } = route.stops;
    
    // Format stops with student information and times
    const formatStopWithStudents = (stop, stopNumber) => {
      let stopText = '';
      
      // Get school information if this stop is a school
      const schoolInfo = getSchoolDetails(stop);
      
      stopText += `STOP ${stopNumber}: ${stop.location}\n`;
      if (stop.isSchool) {
        stopText += `School: ${schoolInfo.name || 'Unknown'}\n`;
        stopText += `Address: ${schoolInfo.address || stop.location}\n`;
      }
      
      // Add time information
      if (stop.timeAM || stop.timePM) {
        stopText += `Morning Time: ${formatTime(stop.timeAM)}\n`;
        stopText += `Afternoon Time: ${formatTime(stop.timePM)}\n`;
      }
      
      // Add students at this stop
      if (stop.students && stop.students.length > 0) {
        stopText += 'Students:\n';
        stop.students.forEach(studentEntry => {
          const student = studentEntry.student;
          stopText += `- ${student.firstName} ${student.lastName}\n`;
          
          // Add extra pickups (special services) if available
          if (studentEntry.specialServices && studentEntry.specialServices.length > 0) {
            const activeServices = studentEntry.specialServices.filter(s => s.isActive !== false);
            
            if (activeServices.length > 0) {
              stopText += '  Extra Pickups:\n';
              activeServices.forEach(service => {
                const day = formatDay(service.dayOfWeek);
                const time = formatTime(service.specialTime);
                stopText += `  - ${day} at ${time}\n`;
                if (service.notes) {
                  stopText += `    Note: ${service.notes}\n`;
                }
              });
            }
          }
        });
      } else {
        stopText += 'Students: None\n';
      }
      
      return stopText;
    };

    // Get school details from the schoolCache
    const getSchoolDetails = (stop) => {
      let schoolDetails = {
        name: stop.location,
        address: stop.location
      };
      
      if (stop.isSchool && stop.schoolId && schoolCache[stop.schoolId]) {
        const school = schoolCache[stop.schoolId];
        schoolDetails.name = school.name || stop.location;
        
        // Format address if available
        if (school.address) {
          const addr = school.address;
          const addressParts = [];
          
          if (addr.street) addressParts.push(addr.street);
          if (addr.city) addressParts.push(addr.city);
          if (addr.county) addressParts.push(addr.county);
          if (addr.postCode) addressParts.push(addr.postCode);
          
          schoolDetails.address = addressParts.join(', ') || stop.location;
        }
      }
      
      return schoolDetails;
    };
    
    // Build the summary
    let summaryText = '';
    summaryText += `ROUTE: ${route.name} (Route #${route.routeNo})\n`;
    summaryText += '='.repeat(40) + '\n\n';
    
    summaryText += `OPERATING DAYS: ${operatingDays}\n\n`;
    
    summaryText += 'STOPS:\n';
    summaryText += '-'.repeat(30) + '\n\n';
    
    // Collect all stops
    const allStops = [];
    allStops.push(startingStop);
    if (intermediateStops.length > 0) {
      allStops.push(...intermediateStops);
    }
    allStops.push(endingStop);
    
    // Sort stops by sequence if available
    const sortedStops = allStops.sort((a, b) => 
      typeof a.sequence === 'number' && typeof b.sequence === 'number' 
        ? a.sequence - b.sequence 
        : 0
    );
    
    // Format all stops sequentially
    sortedStops.forEach((stop, index) => {
      summaryText += formatStopWithStudents(stop, index + 1);
      summaryText += '\n';
    });
    
    // Add pricing info if available
    if (route.dailyPrice) {
      summaryText += 'ROUTE DETAILS:\n';
      summaryText += '-'.repeat(30) + '\n';
      summaryText += `Daily Miles: ${route.dailyMiles}\n`;
      if (route.capacity) {
        summaryText += `Vehicle Capacity: ${route.capacity} passengers\n`;
      }
    }
    
    return summaryText;
  };

  // Open the summary modal
  const handleOpenSummary = () => {
    const generatedSummary = generateRouteSummary();
    setSummary(generatedSummary);
    setIsOpen(true);
  };

  // Copy the summary to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Open Share modal and fetch drivers lazily
  const handleOpenShare = async () => {
    setIsShareOpen(true);
    if (driversWithPhone.length > 0) return;
    try {
      setIsDriversLoading(true);
      // Fetch drivers; backend supports pagination, but here we request a larger page if available
      const data = await getDrivers({});
      const list = Array.isArray(data) ? data : (data?.docs || data?.data || []);
      const filtered = list.filter(d => d && d.phoneNumber && String(d.phoneNumber).trim().length > 0);
      // Map to compact objects for dropdown
      const compact = filtered.map(d => ({ _id: d._id, name: d.name || d.shortName || 'Unnamed', phoneNumber: d.phoneNumber }));
      setDriversWithPhone(compact);
    } catch (e) {
      console.error('Failed to load drivers for sharing:', e);
    } finally {
      setIsDriversLoading(false);
    }
  };

  const cleanPhone = (phone) => (phone || '').replace(/\D/g, '');

  const handleShareSubmit = () => {
    // Resolve target phone
    let phone = '';
    if (selectedDriverId) {
      const d = driversWithPhone.find(x => x._id === selectedDriverId);
      phone = d?.phoneNumber || '';
    } else {
      phone = customPhone;
    }

    const cleaned = cleanPhone(phone);
    if (!cleaned) {
      alert('Please select a driver with a phone number or enter a valid phone number.');
      return;
    }

    const encodedMessage = encodeURIComponent(summary || '');
    const url = `https://wa.me/${cleaned}?text=${encodedMessage}`;
    window.open(url, '_blank');
    setIsShareOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpenSummary}
        variant="primary"
        size="md"
        className="shadow-sm"
        data-testid="generate-driver-summary"
        disabled={isLoading}
      >
        <DocumentTextIcon className="w-5 h-5 mr-2" />
        {isLoading ? 'Loading Schools...' : 'Summary'}
      </Button>

      {/* Summary Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Route Summary 
                    </Dialog.Title>
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="link"
                      size="sm"
                      className="rounded-full p-1"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                    <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto text-gray-800 dark:text-gray-200 max-h-96">
                      {summary}
                    </pre>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button
                      type="button"
                      variant={copied ? "success" : "primary"}
                      size="md"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-5 h-5 mr-2" />
                          Copy to Clipboard
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      className="ml-2"
                      onClick={handleOpenShare}
                    >
                      Share
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Share Modal */}
      <Transition appear show={isShareOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsShareOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                    >
                      Share via WhatsApp
                    </Dialog.Title>
                    <Button onClick={() => setIsShareOpen(false)} variant="link" size="sm" className="rounded-full p-1">
                      <XMarkIcon className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Driver (optional)</label>
                      <select
                        className="w-full border rounded-md p-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                        value={selectedDriverId}
                        onChange={(e) => setSelectedDriverId(e.target.value)}
                        disabled={isDriversLoading}
                      >
                        <option value="">-- Choose driver --</option>
                        {driversWithPhone.map((d) => (
                          <option key={d._id} value={d._id}>{`${d.name} (${d.phoneNumber})`}</option>
                        ))}
                      </select>
                      <div className="mt-2">
                        <Button variant="ghost" size="sm" onClick={handleOpenShare} disabled={isDriversLoading}>
                          {isDriversLoading ? 'Loading drivers...' : (driversWithPhone.length ? 'Refresh list' : 'Load drivers')}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Or enter phone number (with country code)</label>
                      <input
                        type="text"
                        className="w-full border rounded-md p-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                        placeholder="e.g., 447700900123"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                      />
                      <p className="mt-1 text-xs text-gray-500">If a driver is selected, that number will be used. Otherwise, the custom number is used.</p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button variant="outline" className="mr-2" onClick={() => setIsShareOpen(false)}>Cancel</Button>
                      <Button variant="primary" onClick={handleShareSubmit}>Open WhatsApp</Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default RouteSummaryGenerator;