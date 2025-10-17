import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLabels } from '@/services/labels';
import { Button } from '@/components/common/Button';
import { TagIcon } from '@heroicons/react/24/outline';

const LabelFilter = ({ selectedLabels = [], onSelectLabel, onGroupByLabel, isGrouped }) => {
  const { data: labels = [], isLoading } = useQuery({
    queryKey: ['labels'],
    queryFn: () => getLabels().then(res => res.data)
  });

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading labels...</div>;
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex flex-wrap gap-2">
        {labels.map(label => (
          <button
            key={label._id}
            onClick={() => onSelectLabel(label._id)}
            className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedLabels.includes(label._id)
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300 bg-opacity-10 hover:bg-opacity-20'
            }`}
            style={{
              backgroundColor: selectedLabels.includes(label._id) ? label.color : 'transparent',
              borderColor: label.color,
              borderWidth: '1px'
            }}
          >
            {label.name}
          </button>
        ))}
      </div>

      <Button
        variant={isGrouped ? 'primary' : 'outline'}
        size="sm"
        onClick={onGroupByLabel}
        className="flex items-center"
      >
        <TagIcon className="h-4 w-4 mr-1" />
        {isGrouped ? 'Ungroup' : 'Group by Label'}
      </Button>
    </div>
  );
};

export default LabelFilter;

