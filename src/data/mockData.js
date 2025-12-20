// Mock data for the platform

export const mockDonationRequests = [
  {
    id: '1',
    title: 'Medical Expenses for Family',
    description: 'Need help with medical bills for emergency surgery',
    amount: 5000,
    currentAmount: 3200,
    status: 'approved',
    receiverName: 'Anonymous',
    category: 'Medical',
    createdAt: '2024-01-15',
    verified: true,
  },
  {
    id: '2',
    title: 'Educational Support',
    description: 'Scholarship funds for underprivileged students',
    amount: 3000,
    currentAmount: 1500,
    status: 'approved',
    receiverName: 'Anonymous',
    category: 'Education',
    createdAt: '2024-01-20',
    verified: true,
  },
  {
    id: '3',
    title: 'Food Assistance',
    description: 'Monthly food supplies for community center',
    amount: 2000,
    currentAmount: 800,
    status: 'approved',
    receiverName: 'Anonymous',
    category: 'Food',
    createdAt: '2024-01-25',
    verified: true,
  },
];

export const mockDonations = [
  {
    id: '1',
    requestId: '1',
    amount: 500,
    anonymous: true,
    status: 'completed',
    date: '2024-01-16',
  },
  {
    id: '2',
    requestId: '2',
    amount: 200,
    anonymous: false,
    status: 'completed',
    date: '2024-01-21',
  },
];

export const mockUsers = [
  {
    id: '1',
    name: 'John Donor',
    email: 'donor@seds.com',
    role: 'donor',
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Jane Receiver',
    email: 'receiver@seds.com',
    role: 'receiver',
    status: 'active',
    createdAt: '2024-01-05',
  },
];

export const mockStats = {
  totalDonations: 125000,
  totalRequests: 45,
  activeDonors: 320,
  activeReceivers: 89,
  completedRequests: 38,
};

