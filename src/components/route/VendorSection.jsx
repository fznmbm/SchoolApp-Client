import React from "react";

const VendorSection = ({ vendor }) => {
  if (!vendor) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Vendor Information
          </h3>
          <div className="mt-4">
            <p className="text-red-500 dark:text-red-400">No vendor assigned to this route</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg transition-colors duration-300 ease-in-out">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Vendor Information
        </h3>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Vendor Name
              </p>
              <p className="mt-1 text-gray-800 dark:text-gray-200">{vendor.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
              <p className="mt-1">
                <span 
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                    vendor.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                  }`}
                  aria-label={`Vendor status: ${vendor.status}`}
                >
                  {vendor.status}
                </span>
              </p>
            </div>
            {vendor.contact && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="mt-1 text-gray-800 dark:text-gray-200">{vendor.contact.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="mt-1 text-gray-800 dark:text-gray-200">{vendor.contact.email}</p>
                </div>
              </>
            )}
            {vendor.address && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                <p className="mt-1 text-gray-800 dark:text-gray-200">
                  {vendor.address.street}, {vendor.address.city}, {vendor.address.state}, {vendor.address.postCode}, {vendor.address.country}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSection;