import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import { FaUsers, FaClipboardCheck, FaChartBar, FaHandHoldingHeart } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage the platform and ensure transparency</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
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
              <p className="text-sm text-gray-600">Pending Requests</p>
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
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-text-dark">$0</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-dark rounded-lg flex items-center justify-center mr-4">
              <FaChartBar className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Analytics</p>
              <p className="text-2xl font-bold text-text-dark">View</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold mb-4 text-text-dark">Admin Features</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            Dashboard content will be implemented here. This includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>User management and verification</li>
            <li>Approve or reject donation requests</li>
            <li>Monitor donation flow</li>
            <li>View analytics and reports</li>
            <li>Track suspicious activities</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;

