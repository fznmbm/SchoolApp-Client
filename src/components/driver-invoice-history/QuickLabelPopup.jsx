import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLabels, addLabelsToInvoice, removeLabelsFromInvoice } from '@/services/labels';
import { Popover } from '@headlessui/react';
import { XMarkIcon, TagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const QuickLabelPopup = ({ invoiceId, currentLabelIds = [], onLabelChange }) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter labels based on search query
  const { data: allLabels = [], isLoading } = useQuery({
    queryKey: ['labels'],
    queryFn: () => getLabels().then(res => res.data)
  });

  // Filter labels based on search query
  const filteredLabels = useMemo(() => {
    if (!searchQuery.trim()) return allLabels;
    
    const query = searchQuery.toLowerCase();
    return allLabels.filter(label => 
      label.name.toLowerCase().includes(query) ||
      label.description?.toLowerCase().includes(query)
    );
  }, [allLabels, searchQuery]);

  const addLabelMutation = useMutation({
    mutationFn: (labelId) => {
     
      return addLabelsToInvoice(invoiceId, [labelId]);
    },
    onSuccess: (data) => {
     
      // Invalidate all invoice queries
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
      queryClient.invalidateQueries(['invoices']);
      // Call the parent's refetch function
      if (onLabelChange) {
       
        onLabelChange();
      }
    },
    onError: (error) => {
      console.error('Error adding label:', error);
    }
  });

  const removeLabelMutation = useMutation({
    mutationFn: (labelId) => {
    
      return removeLabelsFromInvoice(invoiceId, [labelId]);
    },
    onSuccess: (data) => {
      // Invalidate all invoice queries
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
      queryClient.invalidateQueries(['invoices']);
      // Call the parent's refetch function
      if (onLabelChange) {
        onLabelChange();
      }
    },
    onError: (error) => {
      console.error('Error removing label:', error);
    }
  });

  const handleLabelToggle = (labelId) => {
    if (currentLabelIds.includes(labelId)) {
      removeLabelMutation.mutate(labelId);
    } else {
      addLabelMutation.mutate(labelId);
    }
  };

  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200">
        <TagIcon className="h-4 w-4 mr-2" />
        Assign Labels
      </Popover.Button>

      <Popover.Panel className="absolute z-10 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-2">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Assign Labels</h3>
              <Popover.Button className="text-gray-400 hover:text-gray-500">
                <XMarkIcon className="h-4 w-4" />
              </Popover.Button>
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search labels..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {isLoading ? (
            <div className="text-sm text-gray-500 p-2">Loading labels...</div>
          ) : filteredLabels.length === 0 ? (
            <div className="text-sm text-gray-500 p-2">
              {allLabels.length === 0 ? 'No labels available' : 'No matching labels found'}
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredLabels.map(label => (
                <label
                  key={label._id}
                  className="flex items-center space-x-2 p-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={currentLabelIds.includes(label._id)}
                    onChange={() => handleLabelToggle(label._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-sm">{label.name}</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default QuickLabelPopup;
