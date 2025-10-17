import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createOddJob, getOddJob, updateOddJob } from '@services/oddJobs';
import { getAllCorporateAccounts } from '@services/corporateAccount';
import StepIndicator from './StepIndicator';
import OddJobFormStep1 from './OddJobFormStep1';
import OddJobFormStep2 from './OddJobFormStep2';

const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

const OddJobForm = ({ oddJobId }) => {
  const queryClient = useQueryClient();
  const { data: existing } = useQuery({ queryKey: ['odd-job', oddJobId], queryFn: () => getOddJob(oddJobId), enabled: !!oddJobId });
  const { data: corpList } = useQuery({ queryKey: ['corporate-accounts'], queryFn: () => getAllCorporateAccounts({ page: 1, limit: 100 }) });

  const initialValues = existing || {
    title: '',
    bookingSource: 'EXTERNAL',
    corporateAccount: '',
    passenger: { name: '', phone: '', email: '' },
    pickup: { whenType: 'ONE_OFF', dateTime: '', startDate: '', endDate: '', time: '', operatingDays: ['monday','tuesday','wednesday','thursday','friday'] },
    pickupAddress: { line1: '', postCode: '', country: 'United Kingdom' },
    dropoffAddress: { line1: '', postCode: '', country: 'United Kingdom' },
    quotedPrice: '',
    notes: '',
  };

  const { mutate: submitCreate, isPending: isSaving } = useMutation({
    mutationFn: (payload) => (oddJobId ? updateOddJob({ id: oddJobId, data: payload }) : createOddJob(payload)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odd-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['odd-job'] });
      window.history.back();
    },
  });

  const onSubmit = (values) => {
    const v = { ...values };
    
    // Handle corporate account
    if (v.bookingSource === 'CORPORATE') {
      v.corporateAccount = v.corporateAccount || (Array.isArray(corpList?.data) ? corpList.data[0]?._id : undefined);
    } else {
      v.corporateAccount = undefined;
    }

    // Handle pickup date/time
    if (v.pickup.whenType === 'ONE_OFF') {
      // For one-off jobs, use dateTime field
      v.pickup.startDate = undefined;
      v.pickup.endDate = undefined;
      v.pickup.time = undefined;
      v.pickup.operatingDays = undefined;
      
      // Ensure dateTime is a valid ISO string
      if (v.pickup.dateTime) {
        v.pickup.dateTime = new Date(v.pickup.dateTime).toISOString();
      }
    } else {
      // For recurring jobs
      v.pickup.dateTime = undefined;
      
      // Ensure dates are valid ISO strings
      if (v.pickup.startDate) {
        v.pickup.startDate = new Date(v.pickup.startDate).toISOString();
      }
      if (v.pickup.endDate) {
        v.pickup.endDate = new Date(v.pickup.endDate).toISOString();
      }
      
      // Ensure time is in HH:mm format
      if (v.pickup.time) {
        const [hours, minutes] = v.pickup.time.split(':');
        v.pickup.time = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
    }

    submitCreate(v);
  };

  const [step, setStep] = useState(1);
  const [formState, setFormState] = useState(initialValues);

  useEffect(() => {
    if (existing) {
      // Format dates and times for form inputs
      const formatted = {
        ...existing,
        // Ensure corporateAccount is the ID string
        corporateAccount: existing.corporateAccount?._id || existing.corporateAccount || '',
        pickup: {
          ...existing.pickup,
          // Format datetime-local
          dateTime: existing.pickup.dateTime ? new Date(existing.pickup.dateTime).toISOString().slice(0, 16) : '',
          // Format date inputs
          startDate: existing.pickup.startDate ? new Date(existing.pickup.startDate).toISOString().slice(0, 10) : '',
          endDate: existing.pickup.endDate ? new Date(existing.pickup.endDate).toISOString().slice(0, 10) : '',
          // Extract time from dateTime for recurring jobs or use existing time
          time: existing.pickup.whenType === 'ONE_OFF' && existing.pickup.dateTime 
            ? new Date(existing.pickup.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            : existing.pickup.time || ''
        }
      };
      setFormState(formatted);
    }
  }, [existing]);

  return (
    <div className="space-y-6">
      <StepIndicator currentStep={step} steps={["Basic Details", "Schedule & Address"]} />
      {step === 1 ? (
        <OddJobFormStep1
          initialValues={formState}
          onNext={(vals) => { setFormState({ ...formState, ...vals }); setStep(2); }}
        />
      ) : (
        <OddJobFormStep2
          initialValues={formState}
          corpList={corpList}
          onBack={(vals) => { setFormState({ ...formState, ...vals }); setStep(1); }}
          onSubmit={(vals) => onSubmit({ ...formState, ...vals })}
        />
      )}
    </div>
  );
};

export default OddJobForm;


