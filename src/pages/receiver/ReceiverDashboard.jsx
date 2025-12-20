import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import { FaFileAlt, FaClipboardCheck, FaHandHoldingHeart } from 'react-icons/fa';

const ReceiverDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-600">Manage your donation requests</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaFileAlt className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Requests</p>
              <p className="text-2xl font-bold text-text-dark">0</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
              <FaClipboardCheck className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-text-dark">0</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Received</p>
              <p className="text-2xl font-bold text-text-dark">$0</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4 text-text-dark">Quick Actions</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Dashboard content will be implemented here. This includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Submit new donation requests</li>
            <li>Upload supporting documents</li>
            <li>View request status</li>
            <li>See received donations (anonymous)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ReceiverDashboard;

