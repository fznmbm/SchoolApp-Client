import React from 'react';
import { Formik, Form } from 'formik';
import Input from '@components/common/input/Input';
import Select from '@components/common/input/Select';

const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

const OddJobFormStep2 = ({ initialValues, corpList, onBack, onSubmit }) => {
  const corpOptions = (corpList?.data || []).map((c) => ({ id: c._id, name: `${c.companyName} (${c.corporateAccountID})` }));
  const whenOptions = [
    { id: 'ONE_OFF', name: 'One-off' },
    { id: 'RECURRING', name: 'Recurring' },
  ];
  return (
    <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit}>
      {({ values, setFieldValue }) => (
        <Form className="space-y-6">
          {values.bookingSource === 'CORPORATE' && (
            <Select name="corporateAccount" label="Corporate Account" options={corpOptions} placeholder="Select account" />
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <Select name="pickup.whenType" label="When" options={whenOptions} />

            {values.pickup.whenType === 'ONE_OFF' ? (
              <Input name="pickup.dateTime" label="Pickup Date & Time" type="datetime-local" />
            ) : (
              <>
                <Input name="pickup.startDate" label="Start Date" type="date" />
                <Input name="pickup.endDate" label="End Date" type="date" />
                <Input name="pickup.time" label="Pickup Time" type="time" />
                <div className="md:col-span-2">
                  <div className="block text-sm font-medium mb-1.5">Operating Days</div>
                  <div className="flex flex-wrap gap-3">
                    {days.map((d) => (
                      <label key={d} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={values.pickup.operatingDays?.includes(d)}
                          onChange={(e) => {
                            const set = new Set(values.pickup.operatingDays || []);
                            if (e.target.checked) set.add(d); else set.delete(d);
                            setFieldValue('pickup.operatingDays', Array.from(set));
                          }}
                        />
                        <span className="capitalize">{d}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-2">Pickup Address</div>
                <Input name="pickupAddress.line1" label="Line 1" />
                <Input name="pickupAddress.line2" label="Line 2" />
                <Input name="pickupAddress.city" label="City" />
                <Input name="pickupAddress.county" label="County" />
                <Input name="pickupAddress.postCode" label="Post Code" />
              </div>
              <div>
                <div className="font-medium mb-2">Dropoff Address</div>
                <Input name="dropoffAddress.line1" label="Line 1" />
                <Input name="dropoffAddress.line2" label="Line 2" />
                <Input name="dropoffAddress.city" label="City" />
                <Input name="dropoffAddress.county" label="County" />
                <Input name="dropoffAddress.postCode" label="Post Code" />
              </div>
            </div>

            <Input name="quotedPrice" label="Quoted Price (£)" type="number" />
            <Input name="notes" label="Notes" multiline />
          </div>

          <div className="flex justify-between gap-2">
            <button type="button" className="px-4 py-2 border rounded-md" onClick={() => onBack(values)}>Back</button>
            <div className="space-x-2">
              <button type="button" className="px-4 py-2 border rounded-md" onClick={() => window.history.back()}>Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Save</button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OddJobFormStep2;


