import React from "react";
import PermanentDriverSection from "./PermanentDriverSection";
import TemporaryDriverSection from "./TemporaryDriverSection";
import PASection from "./PASection";

const StaffSection = ({ route, routeId }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Staff</h3>
        <div className="mt-4 space-y-8">
          {/* Permanent Driver */}
          <PermanentDriverSection route={route} routeId={routeId} />

          {/* Temporary Driver Section */}
          <TemporaryDriverSection route={route} routeId={routeId} />

          {/* PA Section */}
          <PASection route={route} routeId={routeId} />
        </div>
      </div>
    </div>
  );
};

export default StaffSection;