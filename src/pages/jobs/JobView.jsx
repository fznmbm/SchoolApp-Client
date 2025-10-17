import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJob } from '@services/jobs';
import { Button } from '@components/common/Button';
import Card from '@components/common/Card';
import Spinner from '@components/common/Spinner';
import { HistoryTracker } from '@components/common/HistoryTracker';
import { getCompany } from '@services/company';
import { format } from 'date-fns';
import { getRoute, getTemporaryDriverHistory } from '@services/route';
import { getSchool } from '@services/school';

const defaultColumns = [
  'routeNo',
  'title',
  'bookingCreatedAt',
  'journeyDates',
  'pickupAddress',
  'dropoffAddress',
  'parentPhone',
  'driver',
  'vehicle',
  'pa',
  'contractPrice',
];

const getPreferences = () => {
  try {
    const raw = localStorage.getItem('job_view_columns');
    if (!raw) return defaultColumns;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return defaultColumns;
};

const JobView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading, isError, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id),
    enabled: !!id,
  });

  // Prefer company.settings.jobViewColumns; fallback to localStorage default
  const { data: company } = useQuery({
    queryKey: ['company-settings'],
    queryFn: () => getCompany(),
  });

  const columns = useMemo(() => {
    const serverCols = company?.settings?.jobViewColumns;
    if (Array.isArray(serverCols) && serverCols.length > 0) return serverCols;
    return getPreferences();
  }, [company]);

  // Always declare hooks at top-level; fetch extras conditionally via enabled
  const { data: extras, isLoading: isExtrasLoading } = useQuery({
    queryKey: ['job-history-extras', job?._id],
    enabled: Boolean(job?._id),
    queryFn: async () => {
      const start = new Date(job.startDate);
      const end = new Date(job.endDate);

      // Helper to test date range overlap
      const rangesOverlap = (aStart, aEnd, bStart, bEnd) => {
        const as = new Date(aStart);
        const ae = new Date(aEnd);
        const bs = new Date(bStart);
        const be = new Date(bEnd);
        return as <= be && bs <= ae;
      };

      // 1) Route history: temporary driver changes overlapping job period
      let routeTempDriverHistory = [];
      const idToNameMap = {};
      const routeObj = job.route || {};
      if (routeObj?._id) {
        try {
          const routeFull = await getRoute(routeObj._id);
          const rHist = Array.isArray(routeFull?.history) ? routeFull.history : [];
          routeTempDriverHistory = rHist
            .filter(h => h?.field === 'temporaryDriver')
            .filter(h => {
              const nv = h?.newValue || {};
              return nv?.startDate && nv?.endDate && rangesOverlap(nv.startDate, nv.endDate, start, end);
            })
            .map(h => ({ ...h }));

          // Also try to build a driver id -> name map from temporary driver history endpoint (populated)
          try {
            const tempHist = await getTemporaryDriverHistory(routeObj._id);
            (tempHist || []).forEach((t) => {
              const drv = t?.driver;
              if (drv && (drv._id || typeof drv === 'string')) {
                const key = String(drv._id || drv);
                const name = typeof drv === 'object' ? (drv.name || '') : '';
                if (key && name) idToNameMap[key] = name;
              }
            });
          } catch (_) {}
        } catch (_) {
          routeTempDriverHistory = [];
        }
      }

      // 2) School holiday history changes within the job period
      const stopArray = Array.isArray(job.stops)
        ? job.stops
        : [job.stops?.startingStop, ...(job.stops?.intermediateStops || []), job.stops?.endingStop].filter(Boolean);
      const schoolIds = Array.from(new Set((stopArray || []).filter(s => s?.isSchool && s?.schoolId).map(s => String(s.schoolId))));
      const schools = [];
      for (const sid of schoolIds) {
        try {
          const school = await getSchool(sid);
          const schoolName = school?.name || 'School';
          const history = school?.history || [];
          // Include entries where any holiday period (old or new) overlaps job period
          const overlapsHolidayRange = (arr) => {
            if (!Array.isArray(arr)) return false;
            return arr.some(r => r?.startDate && r?.endDate && rangesOverlap(r.startDate, r.endDate, start, end));
          };
          const filtered = history
            .filter(h => String(h.field) === 'holidays')
            .filter(h => overlapsHolidayRange(h.oldValue) || overlapsHolidayRange(h.newValue))
            .map(h => ({ ...h }));
          if (filtered.length) {
            schools.push({ schoolId: sid, schoolName, history: filtered });
          }
        } catch (_) {
          // ignore failures per-school
        }
      }

      // Build single combined list (route temp driver + school holidays) in chronological order
      const schoolHolidayHistory = schools.flatMap(s => s.history.map(h => ({ ...h, schoolName: s.schoolName })));
      const combinedHistory = [...routeTempDriverHistory, ...schoolHolidayHistory].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      return { combinedHistory, idToNameMap };
    }
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-red-600">{error?.message || 'Failed to load job'}</div>
        </Card>
      </div>
    );
  }

  if (!job) return null;

  const route = job.route || {};
  const permanentDriver = job.permanentDriver || {};
  const tempDriver = job.temporaryDriver?.driver || null;
  const driver = tempDriver || permanentDriver || {};
  const pa = job.pa || {};

  const contractPrice = route?.driverPrice ?? route?.dailyPrice ?? null;
  const vehicleText = driver?.vehicle
    ? [driver.vehicle.make, driver.vehicle.model, driver.vehicle.registrationNumber]
        .filter(Boolean)
        .join(' ')
    : '';

  const formatDateTime = (value) => {
    try {
      return format(new Date(value), 'dd MMM yyyy, HH:mm');
    } catch {
      return '';
    }
  };

  const formatDateOnly = (value) => {
    try {
      return format(new Date(value), 'dd MMM yyyy');
    } catch {
      return '';
    }
  };

  // Derive flattened fields
  const fields = {
    routeNo: route.routeNo,
    title: job.title,
    bookingCreatedAt: formatDateTime(job.createdAt),
    journeyDates: `${formatDateOnly(job.startDate)} → ${formatDateOnly(job.endDate)}`,
    pickupAddress: job.stops?.find?.(s => s?.type === 'start')?.location || job.stops?.startingStop?.location,
    dropoffAddress: job.stops?.find?.(s => s?.type === 'end')?.location || job.stops?.endingStop?.location,
    parentPhone: undefined, // not stored on job directly; shown in daily jobs table per-student
    driver: driver?.name ? `${driver.name} (${driver.driverNumber || ''})` : '',
    vehicle: vehicleText,
    pa: pa?.name || '',
    contractPrice: contractPrice != null ? `£${Number(contractPrice).toFixed(2)}` : '',
  };

  // extras hook declared above

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => navigate(-1)}>Back</Button>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/jobs/${id}/edit`)}>Edit</Button>
          <Button variant="outline" onClick={() => navigate('/settings/job-display')}>Preferences</Button>
        </div>
      </div>

      <Card className="p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th key={col} className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {col.replace(/([A-Z])/g, ' $1')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              {columns.map((col) => (
                <td key={col} className="px-4 py-4 whitespace-nowrap text-sm text-text-primary dark:text-white">
                  {fields[col] ?? ''}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </Card>

      {/* Single unified history: job changes + related route/school changes */}
      {(() => {
        const extra = extras?.combinedHistory || [];
        const base = Array.isArray(job.history) ? job.history : [];
        const unified = [...base, ...extra].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        if (!unified.length) return null;
        return (
          <HistoryTracker
            history={unified}
            title="History"
            subtitle="Job, route and school updates during this job period"
            entityType="route"
            idToNameMap={extras?.idToNameMap || {}}
            defaultCollapsed={false}
          />
        );
      })()}
    </div>
  );
};

export default JobView;


