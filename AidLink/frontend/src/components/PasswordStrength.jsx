import React from 'react';
import { getPasswordStrength } from '../utils/validators';

const PasswordStrength = ({ password }) => {
  const { strength, label, color } = getPasswordStrength(password);

  if (!password) return null;

  const colorClasses = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${colorClasses[color]}`}
            style={{ width: `${((strength + 1) / 5) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium text-${color}-600`}>
          {label}
        </span>
      </div>
    </div>
  );
};

export default PasswordStrength;

