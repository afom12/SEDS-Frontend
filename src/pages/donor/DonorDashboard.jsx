import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';
import { dataService } from '../../services/dataService';
import { FaHandHoldingHeart, FaHistory, FaCheckCircle, FaArrowRight, FaClock } from 'react-icons/fa';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [totalDonated, setTotalDonated] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [donationsResult, requestsResult] = await Promise.all([
        dataService.getDonations(),
        dataService.getDonationRequests(),
      ]);

      if (donationsResult.success) {
        const donations = donationsResult.data;
        const total = donations
          .filter(d => d.status === 'completed')
          .reduce((sum, d) => sum + d.amount, 0);
        setTotalDonated(total);
        setCompletedCount(donations.filter(d => d.status === 'completed').length);
      }

      if (requestsResult.success) {
        setActiveRequests(requestsResult.data.filter(r => r.status === 'approved').slice(0, 3));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-text-dark mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">Make a difference with your donations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-4">
              <FaHandHoldingHeart className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Donated</p>
              <p className="text-2xl font-bold text-text-dark">${totalDonated.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
              <FaCheckCircle className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-text-dark">{completedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
              <FaHistory className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-text-dark">{mockDonations.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-xl transition-shadow cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/donor/requests" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">Browse Requests</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Find verified requests that need your support
                </p>
                <span className="text-primary font-medium flex items-center">
                  View Requests <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaHandHoldingHeart className="text-primary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>

        <Card className="hover:shadow-xl transition-shadow cursor-pointer animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Link to="/donor/history" className="block">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-text-dark mb-2">Donation History</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Track all your donations and their impact
                </p>
                <span className="text-primary font-medium flex items-center">
                  View History <FaArrowRight className="ml-2" />
                </span>
              </div>
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                <FaHistory className="text-secondary text-2xl" />
              </div>
            </div>
          </Link>
        </Card>
      </div>

      {/* Featured Requests */}
      {activeRequests.length > 0 && (
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-dark">Featured Requests</h2>
            <Link to="/donor/requests" className="text-primary hover:text-primary-dark text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {activeRequests.map(request => (
              <Link
                key={request.id}
                to={`/donor/requests/${request.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-text-dark mb-2 line-clamp-2">{request.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <FaClock className="mr-1" />
                    {request.urgency}
                  </span>
                  <span className="text-primary font-medium">${request.amount.toLocaleString()}</span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: `${request.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{request.progress}% funded</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DonorDashboard;





