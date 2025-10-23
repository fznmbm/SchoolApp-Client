import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  XMarkIcon,
  UserIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  ExclamationCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { getDrivers } from '@services/drivers';
import { getAllPAs } from '@services/pa';

const RecipientSelector = ({ selected = [], onChange, singleRecipient = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipientType, setRecipientType] = useState('driver'); 
  const [customNumber, setCustomNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const [filters, setFilters] = useState({
    status: 'ACTIVE',
  });

  const { data: drivers,
    isLoading: driversLoading,
    error: driversError } = useQuery({
      queryKey: ['drivers', filters],
      queryFn: () => getDrivers(filters),
    });

  const { data: pas,
    isLoading: pasLoading,
    error: pasError } = useQuery({
      queryKey: ['pas', { status: 'ACTIVE' }],
      queryFn: () => getAllPAs({ status: 'ACTIVE' }),
    });


  // Update selected items when selected prop changes
  const currentSelectedItems = useMemo(() => {
    return selected.map(phoneNumber => {
      // Try to find the driver with this phone number
      const driver = drivers?.find(d => d.phoneNumber === phoneNumber);
      if (driver) {
        return {
          id: driver._id,
          phoneNumber: driver.phoneNumber,
          name: driver.name,
          type: 'driver',
          data: driver
        };
      }
      
      // Try to find the PA with this phone number
      const pa = pas?.data?.find(p => p.contact?.phone === phoneNumber);
      if (pa) {
        return {
          id: pa._id,
          phoneNumber: pa.contact.phone,
          name: pa.name,
          type: 'pa',
          data: pa
        };
      }
      
      // If not found (probably a custom number), create a custom item
      return {
        id: phoneNumber,
        phoneNumber,
        name: phoneNumber,
        type: 'custom'
      };
    });
  }, [selected, drivers, pas]);

  // Only update state when items actually change
  useEffect(() => {
    // Check if the items have actually changed before updating state
    const itemsChanged = JSON.stringify(currentSelectedItems) !== JSON.stringify(selectedItems);
    if (itemsChanged) {
      setSelectedItems(currentSelectedItems);
    }
  }, [currentSelectedItems, selectedItems]);

  // Handle selecting a recipient
  const handleSelect = (item) => {
    if (singleRecipient) {
      onChange([item.phoneNumber]);
    } else {
      const isAlreadySelected = selected.includes(item.phoneNumber);

      if (isAlreadySelected) {
        onChange(selected.filter(r => r !== item.phoneNumber));
      } else {
        onChange([...selected, item.phoneNumber]);
      }
    }

    if (singleRecipient) {
      setIsDropdownOpen(false);
    }
  };

  // Remove a selected recipient
  const handleRemove = (item) => {
    onChange(selected.filter(r => r !== item.phoneNumber));
  };

  // Add custom phone number
  const handleAddCustomNumber = () => {
    if (!customNumber) return;

    // Basic validation for phone number format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(customNumber)) {
      alert('Please enter a valid phone number (+1234567890 or 1234567890)');
      return;
    }

    // Format number if needed
    let formattedNumber = customNumber;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = `+${formattedNumber}`;
    }

    const customItem = {
      id: formattedNumber,
      phoneNumber: formattedNumber,
      name: formattedNumber,
      type: 'custom'
    };

    handleSelect(customItem);
    setCustomNumber('');
  };

  // Select all drivers
  const handleSelectAllDrivers = () => {
    const driverPhoneNumbers = drivers
      ?.filter(driver => driver.phoneNumber)
      ?.map(driver => driver.phoneNumber) || [];
    
    const newSelected = [...new Set([...selected, ...driverPhoneNumbers])];
    onChange(newSelected);
  };

  // Select all PAs
  const handleSelectAllPAs = () => {
    const paPhoneNumbers = pas?.data
      ?.filter(pa => pa.contact?.phone)
      ?.map(pa => pa.contact.phone) || [];
    
    const newSelected = [...new Set([...selected, ...paPhoneNumbers])];
    onChange(newSelected);
  };

  // Select all staff (drivers + PAs)
  const handleSelectAllStaff = () => {
    const driverPhoneNumbers = drivers
      ?.filter(driver => driver.phoneNumber)
      ?.map(driver => driver.phoneNumber) || [];
    
    const paPhoneNumbers = pas?.data
      ?.filter(pa => pa.contact?.phone)
      ?.map(pa => pa.contact.phone) || [];
    
    const allStaffNumbers = [...driverPhoneNumbers, ...paPhoneNumbers];
    const newSelected = [...new Set([...selected, ...allStaffNumbers])];
    onChange(newSelected);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('recipient-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format status as a badge
  const renderStatusBadge = (status) => {
    let bgColor = 'bg-gray-100 text-gray-800';

    switch (status) {
      case 'ACTIVE':
        bgColor = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        break;
      case 'INACTIVE':
        bgColor = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        break;
      case 'ON_LEAVE':
        bgColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        break;
    }

    return (
      <span className={`text-xs ${bgColor} px-2 py-0.5 rounded-full`}>
        {status}
      </span>
    );
  };

  return (
    <div className="relative">
      {/* Selected Recipients */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedItems.map((item) => (
          <div
            key={`${item.id || item.phoneNumber}`}
            className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
          >
            {item.type === 'driver' ? (
              <TruckIcon className="w-4 h-4 mr-1" />
            ) : item.type === 'pa' ? (
              <UserGroupIcon className="w-4 h-4 mr-1" />
            ) : (
              <UserIcon className="w-4 h-4 mr-1" />
            )}
            <span className="mr-1">{item.name || "Unknown"}</span>
            {item.phoneNumber && (
              <span className="text-xs text-blue-600 dark:text-blue-300">{item.phoneNumber}</span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(item)}
              className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Recipient Selector */}
      <div className="relative" id="recipient-dropdown">
        <div className="flex">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for drivers or add phone numbers"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
            {/* Recipient Type Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setRecipientType('driver')}
                className={clsx(
                  "flex-1 px-4 py-2 text-sm font-medium text-center focus:outline-none",
                  recipientType === 'driver'
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <div className="flex items-center justify-center">
                  <TruckIcon className="w-4 h-4 mr-1" />
                  Drivers
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRecipientType('pa')}
                className={clsx(
                  "flex-1 px-4 py-2 text-sm font-medium text-center focus:outline-none",
                  recipientType === 'pa'
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <div className="flex items-center justify-center">
                  <UserGroupIcon className="w-4 h-4 mr-1" />
                  PAs
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRecipientType('custom')}
                className={clsx(
                  "flex-1 px-4 py-2 text-sm font-medium text-center focus:outline-none",
                  recipientType === 'custom'
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <div className="flex items-center justify-center">
                  <UserIcon className="w-4 h-4 mr-1" />
                  Custom
                </div>
              </button>
            </div>

            {/* Select All Buttons */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllDrivers}
                  disabled={!drivers?.length}
                  className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select All Drivers ({drivers?.filter(d => d.phoneNumber)?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={handleSelectAllPAs}
                  disabled={!pas?.data?.length}
                  className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full hover:bg-green-200 dark:hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select All PAs ({pas?.data?.filter(p => p.contact?.phone)?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={handleSelectAllStaff}
                  disabled={!drivers?.length && !pas?.data?.length}
                  className="px-3 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Select All Staff ({(drivers?.filter(d => d.phoneNumber)?.length || 0) + (pas?.data?.filter(p => p.contact?.phone)?.length || 0)})
                </button>
              </div>
            </div>

            {/* Recipient List or Custom Input */}
            {recipientType === 'custom' ? (
              <div className="p-3">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCustomNumber();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomNumber}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Enter a complete phone number with country code
                </div>
              </div>
            ) : recipientType === 'pa' ? (
              <div>
                {/* Loading state */}
                {pasLoading && (
                  <div className="p-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading PAs...</p>
                  </div>
                )}

                {/* Error state */}
                {pasError && (
                  <div className="p-4 text-center text-red-500 dark:text-red-400">
                    <ExclamationCircleIcon className="w-6 h-6 mx-auto mb-2" />
                    <p>Failed to load PAs. Please try again.</p>
                  </div>
                )}

                {/* PA list */}
                {!pasLoading && !pasError && (
                  <>
                    {pas?.data && pas.data.length > 0 ? (
                      pas.data
                        .filter(pa => {
                          if (!searchTerm) return true;
                          const searchLower = searchTerm.toLowerCase();
                          return (
                            pa.name?.toLowerCase().includes(searchLower) ||
                            pa.paNumber?.toLowerCase().includes(searchLower) ||
                            pa.contact?.phone?.includes(searchTerm) ||
                            pa.contact?.email?.toLowerCase().includes(searchLower)
                          );
                        })
                        .map((pa) => {
                        const phoneNumberDisplay = pa.contact?.phone || 'No phone number';
                        const isSelectable = !!pa.contact?.phone;
                        const isSelected = pa.contact?.phone && selected.includes(pa.contact.phone);

                        return (
                          <div
                            key={pa._id}
                            onClick={() => {
                              if (isSelectable) {
                                handleSelect({
                                  id: pa._id,
                                  phoneNumber: pa.contact.phone,
                                  name: pa.name,
                                  type: 'pa',
                                  data: pa
                                });
                              }
                            }}
                            className={clsx(
                              "flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700",
                              isSelectable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : "opacity-70 cursor-not-allowed",
                              isSelected && "bg-green-50 dark:bg-green-900/30"
                            )}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <UserGroupIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {pa.name || "Unnamed PA"}
                                  {pa.paNumber && (
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                      #{pa.paNumber}
                                    </span>
                                  )}
                                </span>
                                {pa.status && (
                                  <span className="ml-2">
                                    {renderStatusBadge(pa.status)}
                                  </span>
                                )}
                              </div>
                              <div className="ml-7 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                {phoneNumberDisplay}
                                {!isSelectable && (
                                  <span className="ml-2 text-xs text-red-500 dark:text-red-400">
                                    (Cannot select - missing phone number)
                                  </span>
                                )}
                                {pa.contact?.email && (
                                  <span className="mx-2">•</span>
                                )}
                                {pa.contact?.email}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                        <UserGroupIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        {searchTerm ? (
                          <p>No PAs found matching "{searchTerm}"</p>
                        ) : (
                          <p>No active PAs available</p>
                        )}
                        <p className="mt-1 text-xs">Try a different search or add a custom number</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div>
                {/* Loading state */}
                {driversLoading && (
                  <div className="p-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading drivers...</p>
                  </div>
                )}

                {/* Error state */}
                {driversError && (
                  <div className="p-4 text-center text-red-500 dark:text-red-400">
                    <ExclamationCircleIcon className="w-6 h-6 mx-auto mb-2" />
                    <p>Failed to load drivers. Please try again.</p>
                  </div>
                )}

                {/* Driver list */}
                {!driversLoading && !driversError && (
                  <>
                    {drivers && drivers.length > 0 ? (
                      drivers
                        .filter(driver => {
                          if (!searchTerm) return true;
                          const searchLower = searchTerm.toLowerCase();
                          return (
                            driver.name?.toLowerCase().includes(searchLower) ||
                            driver.driverNumber?.toLowerCase().includes(searchLower) ||
                            driver.phoneNumber?.includes(searchTerm) ||
                            driver.email?.toLowerCase().includes(searchLower)
                          );
                        })
                        .map((driver) => {
                        // Create a phoneNumber display value that can be null
                        const phoneNumberDisplay = driver.phoneNumber || 'No phone number';
                        const isSelectable = !!driver.phoneNumber;
                        const isSelected = driver.phoneNumber && selected.includes(driver.phoneNumber);

                        return (
                          <div
                            key={driver._id}
                            onClick={() => {
                              // Only allow selection if driver has a phone number
                              if (isSelectable) {
                                handleSelect({
                                  id: driver._id,
                                  phoneNumber: driver.phoneNumber,
                                  name: driver.name,
                                  type: 'driver',
                                  data: driver
                                });
                              }
                            }}
                            className={clsx(
                              "flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700",
                              isSelectable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : "opacity-70 cursor-not-allowed",
                              isSelected && "bg-blue-50 dark:bg-blue-900/30"
                            )}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <TruckIcon className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                  {driver.name || "Unnamed Driver"}
                                  {driver.driverNumber && (
                                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                      #{driver.driverNumber}
                                    </span>
                                  )}
                                </span>
                                {driver.status && (
                                  <span className="ml-2">
                                    {renderStatusBadge(driver.status)}
                                  </span>
                                )}
                              </div>
                              <div className="ml-7 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                {phoneNumberDisplay}
                                {!isSelectable && (
                                  <span className="ml-2 text-xs text-red-500 dark:text-red-400">
                                    (Cannot select - missing phone number)
                                  </span>
                                )}
                                {driver.email && (
                                  <span className="mx-2">•</span>
                                )}
                                {driver.email}
                              </div>
                              {driver.vehicle && (
                                <div className="ml-7 text-xs text-gray-500 dark:text-gray-400">
                                  Vehicle: {driver.vehicle.make || ''} {driver.vehicle.model || ''}
                                  {driver.vehicle.registrationNumber ? `(${driver.vehicle.registrationNumber})` : ''}
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <CheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                        <UserIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        {searchTerm ? (
                          <p>No drivers found matching "{searchTerm}"</p>
                        ) : (
                          <p>No active drivers available</p>
                        )}
                        <p className="mt-1 text-xs">Try a different search or add a custom number</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientSelector;