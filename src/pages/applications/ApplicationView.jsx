import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useDocumentViewer } from '../../components/common/DocumentViewer';
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
    
    // Handle Google Drive URLs
    let viewUrl = documentUrl;
    const isGoogleDrive = documentUrl.includes('drive.google.com/file/d/');
    
    if (isGoogleDrive) {
      // Extract file ID from Google Drive URL
      const fileIdMatch = documentUrl.match(/\/file\/d\/([^\/]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        // Create a proper embed URL
        viewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    openDocument(viewUrl, {
      title: fileName,
      downloadUrl: documentUrl,
      type: 'document',
      fileName: fileName,
      isImage: false,
      isGoogleDrive: isGoogleDrive
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
          </div>
        </div>

        {/* Work Eligibility */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Work Eligibility</h2>
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">Right to Work</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">
                {application.rightToWork ? 'Yes' : 'No'}
              </div>
            </div>
            {application.workPermitDetails && (
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
              <label className="text-sm font-medium text-gray-400 mb-1">Has DBS</label>
              <div className="text-white bg-gray-700 rounded-md px-3 py-2">
                {application.dbsInfo?.hasDBS ? 'Yes' : 'No'}
              </div>
            </div>
            {application.dbsInfo?.hasDBS && (
              <>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-400 mb-1">DBS Number</label>
                  <div className="text-white bg-gray-700 rounded-md px-3 py-2">
                    {application.dbsInfo.dbsNumber || '-'}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-400 mb-1">Issue Date</label>
                  <div className="text-white bg-gray-700 rounded-md px-3 py-2">
                    {application.dbsInfo.issueDate ? new Date(application.dbsInfo.issueDate).toLocaleDateString() : '-'}
                  </div>
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
                    <label className="text-sm font-medium text-gray-400 mb-1">Contact Number</label>
                    <div className="text-white bg-gray-700 rounded-md px-3 py-2">{reference.contactNumber || '-'}</div>
                  </div>
                </div>
              </div>
            ))}
            {(!application.references || application.references.length === 0) && (
              <div className="text-gray-400 text-center py-4">No references provided</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationView;
