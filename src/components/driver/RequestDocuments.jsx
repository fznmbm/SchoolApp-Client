import React, { useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/common/Button";

const DRIVER_DOC_TYPES = [
  { key: "DBS", label: "DBS" },
  { key: "LICENSE", label: "Driving License" },
  { key: "TAXI_LICENSE", label: "Taxi License" },
  { key: "MEDICAL_CERTIFICATE", label: "Medical Certificate" },
];

const VEHICLE_DOC_TYPES = [
  { key: "LICENSE", label: "Vehicle License" },
  { key: "INSURANCE", label: "Insurance" },
  { key: "INSPECTION", label: "Inspection" },
  { key: "MOT", label: "MOT" },
];

const cleanPhone = (phone) => (phone || '').replace(/\D/g, '');

const RequestDocuments = ({ isOpen, onClose, driver }) => {
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [selectedVehicleDocs, setSelectedVehicleDocs] = useState([]);
  const [phone, setPhone] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (driver?.phoneNumber) {
      setPhone(driver.phoneNumber);
    }
  }, [driver]);

  const toggle = (key, isVehicle) => {
    if (isVehicle) {
      setSelectedVehicleDocs((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    } else {
      setSelectedDocs((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    }
  };

  const message = useMemo(() => {
    const name = driver?.name || driver?.shortName || "Driver";
    const docList = [
      ...selectedDocs.map((d) => DRIVER_DOC_TYPES.find((x) => x.key === d)?.label || d),
      ...selectedVehicleDocs.map((d) => `Vehicle: ${VEHICLE_DOC_TYPES.find((x) => x.key === d)?.label || d}`),
    ];
    const docsLine = docList.length ? docList.map((d) => `- ${d}`).join("\n") : "- (please see portal for details)";
    return (
      `Hi ${name},\n\n` +
      `Could you please provide the following document(s) for verification/update?\n\n` +
      `${docsLine}\n\n` +
      `You can upload them via the portal or send them to us here.\n` +
      `Thank you!`
    );
  }, [driver, selectedDocs, selectedVehicleDocs]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed', e);
    }
  };

  const handleShare = () => {
    const cleaned = cleanPhone(phone);
    if (!cleaned) {
      alert('Enter a valid phone number.');
      return;
    }
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleaned}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Request Documents</Dialog.Title>
                  <Button variant="link" size="sm" className="rounded-full p-1" onClick={onClose}>
                    <XMarkIcon className="h-6 w-6" />
                  </Button>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Driver Documents</p>
                    <div className="space-y-2">
                      {DRIVER_DOC_TYPES.map((d) => (
                        <label key={d.key} className="flex items-center space-x-2 text-sm">
                          <input type="checkbox" className="rounded" checked={selectedDocs.includes(d.key)} onChange={() => toggle(d.key, false)} />
                          <span>{d.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Vehicle Documents</p>
                    <div className="space-y-2">
                      {VEHICLE_DOC_TYPES.map((d) => (
                        <label key={d.key} className="flex items-center space-x-2 text-sm">
                          <input type="checkbox" className="rounded" checked={selectedVehicleDocs.includes(d.key)} onChange={() => toggle(d.key, true)} />
                          <span>{d.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone number (with country code)</label>
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., 447700900123" className="w-full border rounded-md p-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700" />
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message Preview</p>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                    <pre className="text-sm font-mono whitespace-pre-wrap overflow-auto text-gray-800 dark:text-gray-200 max-h-64">{message}</pre>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button variant="outline" className="mr-2" onClick={onClose}>Close</Button>
                  <Button variant={copied ? 'success' : 'primary'} className="mr-2" onClick={handleCopy}>
                    {copied ? (<><ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />Copied</>) : (<><ClipboardDocumentIcon className="w-5 h-5 mr-2" />Copy</>)}
                  </Button>
                  <Button variant="primary" onClick={handleShare}><PaperAirplaneIcon className="w-5 h-5 mr-2" />Share</Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RequestDocuments;


