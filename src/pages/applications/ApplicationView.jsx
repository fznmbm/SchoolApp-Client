import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useDocumentViewer } from '../../components/common/DocumentViewer';
import { renderApplicationInNewWindow } from '../../services/applicationDownload';
import { getApplicationById, updateApplicationStatus, markApplicationAsRead } from '../../services/application';

const ApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openDocument, DocumentViewer } = useDocumentViewer();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const data = await getApplicationById(id);
      setApplication(data.data);
      
      // Mark application as read when viewed
      if (data.data && data.data.isNew) {
        try {
          await markApplicationAsRead(id);
        } catch (markError) {
          console.error('Error marking application as read:', markError);
          // Don't show error to user, just log it
        }
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  // Handle document viewing
  const handleViewDocument = (documentUrl, fileName = 'Work Permit Document') => {
    if (!documentUrl) return;
    
    // Normalize Google Drive URLs to an embeddable preview
    let viewUrl = documentUrl;
    let isGoogleDrive = false;

    try {
      const url = new URL(documentUrl);
      if (url.hostname.includes('drive.google.com')) {
        let fileId = null;
        const filePathMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
        if (filePathMatch && filePathMatch[1]) fileId = filePathMatch[1];
        if (!fileId) fileId = url.searchParams.get('id');

        if (fileId) {
          isGoogleDrive = true;
          viewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
        }
      }
    } catch (e) {
      // Ignore URL parse errors; fall back to original URL
    }

    openDocument(viewUrl, {
      title: fileName,
      downloadUrl: documentUrl,
      type: 'document',
      fileName: fileName,
      isImage: false,
      isGoogleDrive
    });
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      // Refresh the application data
      fetchApplication();
    } catch (error) {
      console.error('Error updating application status:', error);
      alert(error.response?.data?.message || 'Failed to update application status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="bg-red-900 border-red-700">
          <div className="text-red-300">Error: {error}</div>
        </Card>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-4">
        <Card className="bg-gray-800 border-gray-700">
          <div className="text-gray-300">Application not found</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Document Viewer Component */}
      <DocumentViewer />
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Application Details</h1>
            <p className="text-gray-300">View application information</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => renderApplicationInNewWindow(application)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              View / Print
            </button>
            {/* Status Update Buttons */}
            <button
              onClick={() => handleStatusUpdate('approved')}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
                application.status === 'approved'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={application.status === 'approved'}
            >
              Approve
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 ${
                application.status === 'rejected'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              disabled={application.status === 'rejected'}
            >
              Reject
            </button>
            <button
              onClick={() => navigate('/applications')}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>

      {/* Application Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Personal Information</h2>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.fullName || '-'}</div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Email</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.email || '-'}</div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Phone Number</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.phoneNumber || '-'}</div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Position</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.position || '-'}</div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Current Address</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.currentAddress || '-'}</div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Previous Address</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.previousAddress || '-'}</div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">National Insurance Number</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.nationalInsuranceNumber || '-'}</div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Nationality</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.nationality || '-'}</div>
            </div>
          </div>
        </div>

        {/* Work Eligibility */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Work Eligibility</h2>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">UK Driving License</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.hasUKDrivingLicense ? 'Yes' : 'No'}</div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Requires Work Permit</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.requiresWorkPermit ? 'Yes' : 'No'}</div>
            </div>
            {(application.workPermitDetails && (application.workPermitDetails.permitNumber || application.workPermitDetails.document)) && (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-400 mb-1">Work Permit Number</label>
                  <div className="text-white bg-gray-700 rounded-md px-3 py-2">
                    {application.workPermitDetails.permitNumber || '-'}
                  </div>
                </div>
                {application.workPermitDetails.document && (
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-400 mb-1">Work Permit Document</label>
                    <button 
                      onClick={() => handleViewDocument(application.workPermitDetails.document, 'Work Permit Document')}
                      className="text-blue-400 hover:text-blue-300 bg-gray-700 rounded-md px-3 py-2 inline-block w-fit transition-colors duration-200"
                    >
                      View Document
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* DBS Information */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">DBS Information</h2>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Registered with DBS Update Service</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.dbsInfo?.isRegisteredWithUpdateService ? 'Yes' : 'No'}</div>
            </div>
            {application.dbsInfo?.isRegisteredWithUpdateService && (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-400 mb-1">Name</label>
                  <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.dbsInfo.name || '-'}</div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                  <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.dbsInfo.dateOfBirth ? new Date(application.dbsInfo.dateOfBirth).toLocaleDateString() : '-'}</div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-400 mb-1">Certificate Number</label>
                  <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.dbsInfo.certificateNumber || '-'}</div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-400 mb-1">Update Service ID</label>
                  <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.dbsInfo.updateServiceId || '-'}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* References */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">References</h2>
          <div className="space-y-6">
            {application.references?.map((reference, index) => (
              <div key={index} className="space-y-4 pb-6 border-b border-gray-700 last:border-0 last:pb-0">
                <h3 className="text-lg font-medium text-white">Reference {index + 1}</h3>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-400 mb-1">Name</label>
                    <div className="text-white bg-gray-700 rounded-md px-3 py-2">{reference.name || '-'}</div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-400 mb-1">Relationship</label>
                    <div className="text-white bg-gray-700 rounded-md px-3 py-2">{reference.relationship || '-'}</div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-400 mb-1">Phone</label>
                    <div className="text-white bg-gray-700 rounded-md px-3 py-2">{reference.phone || '-'}</div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-400 mb-1">Email</label>
                    <div className="text-white bg-gray-700 rounded-md px-3 py-2">{reference.email || '-'}</div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-400 mb-1">Address</label>
                    <div className="text-white bg-gray-700 rounded-md px-3 py-2">{reference.address || '-'}</div>
                  </div>
                </div>
              </div>
            ))}
            {(!application.references || application.references.length === 0) && (
              <div className="text-gray-400 text-center py-4">No references provided</div>
            )}
          </div>
        </div>

        {/* Convictions */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Convictions</h2>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Has Convictions</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">{application.hasConvictions ? 'Yes' : 'No'}</div>
            </div>
            {application.hasConvictions && (
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-400 mb-1">Details</label>
                <div className="text-white bg-gray-700 rounded-md px-3 py-2 whitespace-pre-wrap">{application.convictionDetails || '-'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationView;
