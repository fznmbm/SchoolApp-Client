import React from 'react';
import { Formik, Form } from 'formik';
import Input from '@components/common/input/Input';
import Select from '@components/common/input/Select';
import { Button } from '@components/common/Button';
import Card from '@components/common/Card';

const FilterPanel = ({ initialValues, onSubmit, onSubmitCallback, id }) => {
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
                onSubmit(values);
                if (onSubmitCallback) onSubmitCallback();
            }}
        >
            {({ values, handleChange, setFieldValue }) => (
                <Form id={id}>
                    <Card className="mb-6 p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <Select
                                    label="Status"
                                    name="status"
                                    placeholder="All Statuses"
                                    options={[
                                        { id: '', name: 'All Statuses' },
                                        { id: 'ACTIVE', name: 'Active' },
                                        { id: 'COMPLETED', name: 'Completed' },
                                        { id: 'RENEWED', name: 'Renewed' },
                                        { id: 'CANCELLED', name: 'Cancelled' }
                                    ]}
                                    value={values.status}
                                    onChange={(option) => {
                                        setFieldValue('status', option?.id || '');
                                    }}
                                    aria-label="Filter by status"
                                />
                            </div>

                            <div>
                                <Input
                                    label="Driver"
                                    id="driver"
                                    name="driver"
                                    placeholder="Driver Name"
                                    value={values.driver}
                                    onChange={handleChange}
                                    aria-label="Filter by driver name"
                                />
                            </div>

                            <div className="flex items-end">
                                <Button 
                                    type="submit" 
                                    className="w-full"
                                    aria-label="Apply filters"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </Card>
                </Form>
            )}
        </Formik>
    );
};

export default FilterPanel;