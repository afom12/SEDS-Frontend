import React from 'react';
import { getUrgencyBadge, getTimeRemaining } from '../utils/food-urgency';

/**
 * Urgency Badge Component
 * Displays urgency level with appropriate styling for food items
 */
const UrgencyBadge = ({ urgency, expiresAt, showTimeRemaining = false, size = 'md' }) => {
  const badge = getUrgencyBadge(urgency, expiresAt);
  const timeRemaining = expiresAt ? getTimeRemaining(expiresAt) : null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-md border-2 ${sizeClasses[size]} ${badge.bgColor} ${badge.textColor} ${badge.borderColor}`}
      >
        <span>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>
      {showTimeRemaining && timeRemaining && (
        <span className={`text-xs ${badge.textColor} opacity-75`}>
          {timeRemaining}
        </span>
      )}
    </div>
  );
};

export default UrgencyBadge;

