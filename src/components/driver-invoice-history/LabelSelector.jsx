import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLabels, addLabelsToInvoice, removeLabelsFromInvoice } from '@/services/labels';
import { XMarkIcon, TagIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';

const LabelSelector = ({ invoiceId, currentLabels = [], onOpenManager }) => {
  const queryClient = useQueryClient();

  const { data: labels = [], isLoading } = useQuery({
    queryKey: ['labels'],
    queryFn: () => getLabels().then(res => res.data)
  });

  const addLabelMutation = useMutation({
    mutationFn: (labelId) => addLabelsToInvoice(invoiceId, [labelId]),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoice', invoiceId]);
    }
  });

  const removeLabelMutation = useMutation({
    mutationFn: (labelId) => removeLabelsFromInvoice(invoiceId, [labelId]),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoice', invoiceId]);
    }
  });

  const currentLabelIds = currentLabels.map(label => label._id);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Labels</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenManager}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <TagIcon className="h-4 w-4 mr-1" />
          Manage Labels
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading labels...</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {labels.map(label => {
            const isSelected = currentLabelIds.includes(label._id);
            return (
              <button
                key={label._id}
                onClick={() => {
                  if (isSelected) {
                    removeLabelMutation.mutate(label._id);
                  } else {
                    addLabelMutation.mutate(label._id);
                  }
                }}
                className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                  isSelected
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300 bg-opacity-10 hover:bg-opacity-20'
                } transition-colors duration-200`}
                style={{
                  backgroundColor: isSelected ? label.color : 'transparent',
                  borderColor: label.color,
                  borderWidth: '1px'
                }}
              >
                {label.name}
                {isSelected && (
                  <XMarkIcon className="h-4 w-4 ml-1 hover:text-gray-200" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LabelSelector;

