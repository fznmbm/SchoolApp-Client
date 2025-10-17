import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { globalSearch } from '@services/search';
import {
  UserIcon,
  TruckIcon,
  AcademicCapIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    
    performSearch();
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery) return;
    
    setLoading(true);
    try {
      const response = await globalSearch(searchQuery, 50); 
      setResults(response.data || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowDropdown(false);
    }
  };

  const handleResultClick = (result) => {
    setShowDropdown(false);
    
    switch (result.type) {
      case 'driver':
        navigate(`/drivers/${result.id}`);
        break;
      case 'student':
        navigate(`/students/${result.id}`);
        break;
      case 'route':
        navigate(`/routes/${result.id}`);
        break;
      case 'school':
        navigate(`/schools/${result.id}`);
        break;
      case 'pa':
        navigate(`/pa/${result.id}`);
        break;
      case 'admin':
        navigate(`/admins/${result.id}`);
        break;
      case 'vendor':
        navigate(`/vendors/${result.id}`);
        break;
      case 'training':
        navigate(`/training/${result.id}`);
        break;
      default:
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'driver':
        return <TruckIcon className="h-4 w-4" />;
      case 'student':
        return <AcademicCapIcon className="h-4 w-4" />;
      case 'route':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'school':
        return <BuildingOfficeIcon className="h-4 w-4" />;
      case 'pa':
        return <UserGroupIcon className="h-4 w-4" />;
      case 'admin':
        return <UserIcon className="h-4 w-4" />;
      case 'vendor':
        return <BriefcaseIcon className="h-4 w-4" />;
      case 'training':
        return <ClipboardDocumentCheckIcon className="h-4 w-4" />;
      default:
        return <MagnifyingGlassIcon className="h-4 w-4" />;
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative flex-1 max-w-xl">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-text-tertiary dark:text-text-dark-tertiary" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for drivers, routes, vehicles, schools, students..."
          className="w-full pl-10 pr-8 py-2 text-sm rounded-lg 
                   bg-surface-secondary dark:bg-surface-dark-secondary 
                   text-text-primary dark:text-text-dark-primary 
                   border border-border-light dark:border-border-dark-mode
                   focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchQuery) setShowDropdown(true);
          }}
        />
        
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-2.5 text-text-tertiary dark:text-text-dark-tertiary hover:text-text-primary dark:hover:text-text-dark-primary"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-surface dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark-mode max-h-96 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-text-secondary dark:text-text-dark-secondary">
              <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="mt-2">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <div 
                  key={`${result.type}-${result.id}-${index}`}
                  className="cursor-pointer p-2 hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary rounded-md transition-colors duration-150"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3 p-1.5 bg-surface-secondary dark:bg-surface-dark-secondary rounded-md">
                      {getIconForType(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary dark:text-text-dark-primary truncate">
                        {result.name}
                      </p>
                      <p className="text-xs text-text-tertiary dark:text-text-dark-tertiary truncate">
                        {result.details} • <span className="capitalize">{result.type}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-text-secondary dark:text-text-dark-secondary">
              <p>No results found</p>
              <p className="text-xs mt-1">Try different keywords or check spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;