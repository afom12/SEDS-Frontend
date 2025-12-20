import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import { FaHandHoldingHeart, FaHistory, FaCheckCircle } from 'react-icons/fa';

const DonorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Make a difference with your donations</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
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
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
              <FaCheckCircle className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-text-dark">0</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
              <FaHistory className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Donation History</p>
              <p className="text-2xl font-bold text-text-dark">0</p>
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
            <li>View verified donation requests</li>
            <li>Make anonymous or public donations</li>
            <li>Track donation status</li>
            <li>View donation history</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default DonorDashboard;

