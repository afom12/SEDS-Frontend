import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import Stepper from '../../components/Stepper';
import EmptyState from '../../components/EmptyState';
import { mockReceiverRequests } from '../../data/mockData';
import { FaFileAlt, FaCheckCircle, FaClock, FaTimesCircle, FaHandHoldingHeart } from 'react-icons/fa';

const RequestStatus = () => {
  const navigate = useNavigate();

  const getStatusSteps = (status) => {
    const allSteps = [
      { label: 'Submitted', description: 'Request submitted' },
      { label: 'Under Review', description: 'Admin verification' },
      { label: 'Approved', description: 'Request approved' },
      { label: 'Fulfilled', description: 'Request fulfilled' },
    ];

    let currentStep = 0;
    if (status === 'submitted') currentStep = 0;
    else if (status === 'under_verification') currentStep = 1;
    else if (status === 'approved') currentStep = 2;
    else if (status === 'fulfilled') currentStep = 3;
    else if (status === 'rejected') currentStep = 1; // Stuck at review

    return { steps: allSteps, currentStep };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-green-600 text-2xl" />;
      case 'under_verification':
        return <FaClock className="text-yellow-600 text-2xl" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-600 text-2xl" />;
      default:
        return <FaFileAlt className="text-blue-600 text-2xl" />;
    }
  };

  if (mockReceiverRequests.length === 0) {
    return (
      <div className="p-6 md:p-8">
        <EmptyState
          icon={FaFileAlt}
          title="No requests yet"
          message="Submit your first donation request to get started."
          actionLabel="Submit Request"
          onAction={() => navigate('/receiver/request')}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Request Status</h1>
        <p className="text-gray-600">Track the progress of your donation requests</p>
      </div>

      <div className="space-y-6">
        {mockReceiverRequests.map(request => {
          const { steps, currentStep } = getStatusSteps(request.status);
          
          return (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-semibold text-text-dark">{request.title}</h2>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    Submitted on {new Date(request.submittedAt).toLocaleDateString()}
                  </p>
                  {request.verifiedAt && (
                    <p className="text-gray-600 text-sm">
                      Verified on {new Date(request.verifiedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  {getStatusIcon(request.status)}
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="mb-6">
                <Stepper steps={steps} currentStep={currentStep} />
              </div>

              {/* Request Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6 pt-6 border-t border-gray-200">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Request Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-text-dark">{request.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-text-dark">${request.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Urgency:</span>
                      <span className="font-medium text-text-dark capitalize">{request.urgency}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Funding Progress</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Raised:</span>
                      <span className="font-medium text-text-dark">
                        ${request.currentAmount.toLocaleString()} / ${request.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-secondary h-2 rounded-full transition-all"
                        style={{ width: `${request.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaHandHoldingHeart className="mr-2 text-secondary" />
                      {request.donorCount} donor{request.donorCount !== 1 ? 's' : ''} contributed
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              {request.adminNotes && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Admin Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {request.adminNotes}
                  </p>
                </div>
              )}

              {/* Documents */}
              {request.documents && request.documents.length > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Uploaded Documents</h3>
                  <div className="space-y-2">
                    {request.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 bg-gray-50 rounded-lg"
                      >
                        <FaFileAlt className="text-gray-400 mr-2" />
                        <span className="text-sm text-gray-700">{doc}</span>
                        <span className="ml-auto text-xs text-green-600">Verified</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RequestStatus;

