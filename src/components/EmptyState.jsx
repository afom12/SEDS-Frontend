import React from 'react';
import { FaInbox, FaHandHoldingHeart, FaClipboardList } from 'react-icons/fa';

const EmptyState = ({ 
  icon = FaInbox, 
  title, 
  message, 
  actionLabel, 
  onAction,
  className = '' 
}) => {
  const Icon = icon;

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon className="text-gray-400 text-2xl" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

