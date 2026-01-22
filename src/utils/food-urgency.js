/**
 * Food Urgency Utilities (Frontend)
 * Client-side urgency calculation and badge helpers
 */

/**
 * Calculate urgency level based on expiration date
 */
export const calculateFoodUrgency = (expiresAt, now = new Date()) => {
  if (!expiresAt) {
    return 'MEDIUM';
  }

  const expiryDate = new Date(expiresAt);
  const timeUntilExpiry = expiryDate.getTime() - now.getTime();
  const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);

  if (hoursUntilExpiry <= 6) return 'URGENT';
  if (hoursUntilExpiry <= 24) return 'HIGH';
  if (hoursUntilExpiry <= 72) return 'MEDIUM';
  return 'LOW';
};

/**
 * Check if food item is expiring today
 */
export const isExpiringToday = (expiresAt, now = new Date()) => {
  if (!expiresAt) return false;
  const expiryDate = new Date(expiresAt);
  const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
};

/**
 * Check if food item has expired
 */
export const isExpired = (expiresAt, now = new Date()) => {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= now.getTime();
};

/**
 * Get urgency badge configuration
 */
export const getUrgencyBadge = (urgency, expiresAt = null) => {
  const now = new Date();
  
  if (expiresAt && isExpiringToday(expiresAt, now)) {
    return {
      level: 'URGENT',
      label: 'URGENT – MUST BE GIVEN TODAY',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-500',
      icon: '⚠️',
    };
  }

  if (expiresAt && isExpired(expiresAt, now)) {
    return {
      level: 'EXPIRED',
      label: 'EXPIRED',
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-500',
      icon: '⏰',
    };
  }

  const badges = {
    URGENT: {
      level: 'URGENT',
      label: 'URGENT – Expires Soon',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-500',
      icon: '🚨',
    },
    HIGH: {
      level: 'HIGH',
      label: 'HIGH – Expires Today',
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-500',
      icon: '⚠️',
    },
    MEDIUM: {
      level: 'MEDIUM',
      label: 'MEDIUM Priority',
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-500',
      icon: '📅',
    },
    LOW: {
      level: 'LOW',
      label: 'LOW Priority',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-500',
      icon: '📌',
    },
  };

  return badges[urgency] || badges.MEDIUM;
};

/**
 * Get time remaining until expiration
 */
export const getTimeRemaining = (expiresAt, now = new Date()) => {
  if (!expiresAt) return 'No expiration date';
  
  if (isExpired(expiresAt, now)) {
    return 'EXPIRED';
  }

  const expiryDate = new Date(expiresAt);
  const timeUntilExpiry = expiryDate.getTime() - now.getTime();
  const hoursUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60 * 60));
  const minutesUntilExpiry = Math.floor((timeUntilExpiry % (1000 * 60 * 60)) / (1000 * 60));

  if (hoursUntilExpiry < 1) {
    return `${minutesUntilExpiry} minutes`;
  } else if (hoursUntilExpiry < 24) {
    return `${hoursUntilExpiry} hours`;
  } else {
    const days = Math.floor(hoursUntilExpiry / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
};

