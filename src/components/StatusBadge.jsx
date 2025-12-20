import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Pending',
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Rejected',
    },
    completed: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Completed',
    },
    active: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Active',
    },
    inactive: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Inactive',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;

