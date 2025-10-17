import React from 'react';
import { Formik, Form } from 'formik';
import Input from '@components/common/input/Input';
import Select from '@components/common/input/Select';

const OddJobFormStep1 = ({ initialValues, onNext }) => {
  const bookingSourceOptions = [
    { id: 'EXTERNAL', name: 'External' },
    { id: 'CORPORATE', name: 'Corporate' },
  ];

  return (
    <Formik enableReinitialize initialValues={initialValues} onSubmit={onNext}>
      {() => (
        <Form className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Input name="title" label="Title" required />

            <Select name="bookingSource" label="Booking Source" options={bookingSourceOptions} />

            <Input name="passenger.name" label="Passenger Name" required />
            <Input name="passenger.phone" label="Passenger Phone" />
            <Input name="passenger.email" label="Passenger Email" />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">Continue to Next</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OddJobFormStep1;


