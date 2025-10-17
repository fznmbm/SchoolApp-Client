import React from 'react';
import Select from '@components/common/input/Select';

const RouteSelector = ({ routeOptions, value, onChange }) => {
    return (
        <div>
            <Select
                label="Route"
                name="routeId"
                placeholder="Select a Route"
                options={routeOptions}
                value={value}
                onChange={onChange}
                aria-label="Select route"
            />
        </div>
    );
};

export default RouteSelector;