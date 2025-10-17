import React, { useEffect, useMemo, useState } from 'react';
import Card from '@components/common/Card';
import { Button } from '@components/common/Button';
import { getCompany, updateCompany } from '@services/company';

const allColumns = [
  { id: 'routeNo', label: 'Route No' },
  { id: 'title', label: 'Title' },
  { id: 'bookingCreatedAt', label: 'Booking Created At' },
  { id: 'journeyDates', label: 'Journey Dates' },
  { id: 'pickupAddress', label: 'Pickup Address' },
  { id: 'dropoffAddress', label: 'Dropoff Address' },
  { id: 'parentPhone', label: "Parent's Phone" },
  { id: 'driver', label: 'Driver' },
  { id: 'vehicle', label: 'Vehicle' },
  { id: 'pa', label: 'PA' },
  { id: 'contractPrice', label: 'Contract Price' },
];

const defaultSelected = [
  'routeNo',
  'title',
  'bookingCreatedAt',
  'journeyDates',
  'pickupAddress',
  'dropoffAddress',
  'driver',
  'pa',
];

const JobPreferences = () => {
  const [selected, setSelected] = useState(defaultSelected);
  const [original, setOriginal] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const company = await getCompany();
        if (company?.settings?.jobViewColumns && Array.isArray(company.settings.jobViewColumns)) {
          setSelected(company.settings.jobViewColumns);
          setOriginal(company.settings.jobViewColumns);
        }
      } catch (e) {
        // ignore; fallback to defaults
      }
    };
    load();
  }, []);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const arraysEqualUnordered = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    const as = [...a].sort();
    const bs = [...b].sort();
    for (let i = 0; i < as.length; i++) if (as[i] !== bs[i]) return false;
    return true;
  };

  const isDirty = useMemo(() => {
    const baseline = original ?? defaultSelected;
    return !arraysEqualUnordered(selected, baseline);
  }, [selected, original]);

  const save = async () => {
    try {
      setIsSaving(true);
      const company = await getCompany();
      const newSettings = {
        ...(company?.settings || {}),
        jobViewColumns: selected,
      };
      await updateCompany({ ...(company || {}), settings: newSettings });
      setOriginal(selected);
    } catch (e) {
      // no-op; UI stays as is
    } finally {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setSelected(defaultSelected);
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-text-primary dark:text-text-dark-primary transition-colors duration-200">
            Job Display Preferences
          </h1>
          <p className="mt-2 text-sm text-text-secondary dark:text-text-dark-secondary transition-colors duration-200">
            Configure which columns are visible on the single-row job view.
          </p>
        </div>
      </div>

      <div className="mt-6 bg-surface dark:bg-surface-dark shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-700/30 sm:rounded-xl border border-border-light dark:border-border-dark-mode transition-colors duration-200">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
            {allColumns.map((col) => (
              <label key={col.id} className="flex items-center space-x-3 text-text-primary dark:text-text-dark-primary">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border-light dark:border-border-dark-mode text-primary focus:ring-primary"
                  checked={selected.includes(col.id)}
                  onChange={() => toggle(col.id)}
                />
                <span className="text-sm">{col.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-3 border-t border-border-light dark:border-border-dark-mode px-4 py-4 sm:px-8">
          <Button variant="outline" onClick={reset}>Reset</Button>
          <Button onClick={save} disabled={!isDirty || isSaving} aria-disabled={!isDirty || isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobPreferences;


