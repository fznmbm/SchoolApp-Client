import React, { useState, useMemo } from 'react';
import { Button } from '@/components/common/Button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const LabelFilterModal = ({
  isOpen,
  onClose,
  labels = [],
  selectedLabelIds = [],
  onLabelToggle,
  onClearAll,
  isLoading = false,
  error = null
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  // Mount animation
  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      const timer = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Filter labels based on search query
  const filteredLabels = useMemo(() => {
    if (!searchQuery.trim()) return labels;
    const query = searchQuery.toLowerCase();
    return labels.filter(label => 
      label.name.toLowerCase().includes(query)
    );
  }, [labels, searchQuery]);

  if (!mounted && !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ease-in-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-200 ${
          isOpen ? 'opacity-60' : 'opacity-0'
        }`} 
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`relative bg-gray-900 dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-200 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">
            Filter by Labels
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="px-6 py-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search labels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 bg-gray-800 dark:bg-gray-700 text-white placeholder-gray-400 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mx-auto"></div>
              <p className="mt-3 text-sm text-gray-400">Loading labels...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-400">
              Error loading labels: {error}
            </div>
          ) : filteredLabels.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {labels.length === 0 ? 'No labels available' : 'No labels match your search'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredLabels.map(label => (
                <label
                  key={label._id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedLabelIds.includes(label._id)
                      ? 'bg-gray-800/50 dark:bg-gray-700/50 ring-1 ring-primary/30'
                      : 'hover:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedLabelIds.includes(label._id)}
                      onChange={() => onLabelToggle(label._id)}
                      className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary focus:ring-offset-gray-900"
                    />
                  </div>
                  <span
                    className="px-3 py-1.5 text-sm rounded-md text-white flex-grow text-center font-medium shadow-sm"
                    style={{ backgroundColor: label.color }}
                  >
                    {label.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-800/50 dark:bg-gray-700/50 flex justify-between items-center">
          <div className="flex items-center">
            {selectedLabelIds.length > 0 && (
              <span className="text-sm text-gray-300">
                {selectedLabelIds.length} label{selectedLabelIds.length !== 1 ? 's' : ''} selected
              </span>
            )}
          </div>
          <div className="flex gap-3">
            {selectedLabelIds.length > 0 && (
              <Button
                variant="ghost"
                onClick={onClearAll}
                className="text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Clear all
              </Button>
            )}
            <Button 
              variant="primary"
              onClick={onClose}
              className="bg-primary hover:bg-primary-dark text-white px-6"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelFilterModal;
