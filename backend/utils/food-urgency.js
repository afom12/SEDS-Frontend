/**
 * Food Urgency System
 * Handles urgency calculation and auto-updates for perishable food items
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calculate urgency level based on expiration date and current time
 * @param {Date} expiresAt - Expiration date
 * @param {Date} now - Current date (defaults to now)
 * @returns {string} Urgency level: 'URGENT', 'HIGH', 'MEDIUM', 'LOW'
 */
export const calculateFoodUrgency = (expiresAt, now = new Date()) => {
  if (!expiresAt) {
    return 'MEDIUM'; // Default for non-perishable or no expiry
  }

  const expiryDate = new Date(expiresAt);
  const timeUntilExpiry = expiryDate.getTime() - now.getTime();
  const hoursUntilExpiry = timeUntilExpiry / (1000 * 60 * 60);

  // URGENT: Expires within 6 hours - MUST BE GIVEN TODAY
  if (hoursUntilExpiry <= 6) {
    return 'URGENT';
  }

  // HIGH: Expires within 24 hours - Needs immediate attention
  if (hoursUntilExpiry <= 24) {
    return 'HIGH';
  }

  // MEDIUM: Expires within 3 days - Normal priority
  if (hoursUntilExpiry <= 72) {
    return 'MEDIUM';
  }

  // LOW: More than 3 days until expiry
  return 'LOW';
};

/**
 * Check if food item is expiring today (within 24 hours)
 * @param {Date} expiresAt - Expiration date
 * @param {Date} now - Current date
 * @returns {boolean}
 */
export const isExpiringToday = (expiresAt, now = new Date()) => {
  if (!expiresAt) return false;
  const expiryDate = new Date(expiresAt);
  const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  return hoursUntilExpiry <= 24 && hoursUntilExpiry > 0;
};

/**
 * Check if food item has expired
 * @param {Date} expiresAt - Expiration date
 * @param {Date} now - Current date
 * @returns {boolean}
 */
export const isExpired = (expiresAt, now = new Date()) => {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() <= now.getTime();
};

/**
 * Get urgency badge text and color
 * @param {string} urgency - Urgency level
 * @param {Date} expiresAt - Expiration date (optional)
 * @returns {object} Badge configuration
 */
export const getUrgencyBadge = (urgency, expiresAt = null) => {
  const now = new Date();
  
  // Override urgency if expiring today
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

  // Check if expired
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
 * Auto-update urgency for all perishable food requests/offers
 * Should be called periodically (e.g., every hour via cron)
 */
export const updateFoodUrgency = async () => {
  try {
    const now = new Date();

    // Update requests with perishable food
    const perishableRequests = await prisma.request.findMany({
      where: {
        isPerishable: true,
        expiresAt: { not: null },
        status: { in: ['VERIFIED', 'MATCHED', 'IN_PROGRESS'] },
      },
      include: {
        aidType: true,
      },
    });

    let updatedRequests = 0;
    let expiredRequests = 0;

    for (const request of perishableRequests) {
      if (isExpired(request.expiresAt, now)) {
        // Mark as expired
        await prisma.request.update({
          where: { id: request.id },
          data: {
            status: 'EXPIRED',
            expiredAt: now,
          },
        });
        expiredRequests++;
      } else {
        // Update urgency based on expiration
        const newUrgency = calculateFoodUrgency(request.expiresAt, now);
        if (newUrgency !== request.urgency) {
          await prisma.request.update({
            where: { id: request.id },
            data: { urgency: newUrgency },
          });
          updatedRequests++;
        }
      }
    }

    // Update offers with perishable food
    const perishableOffers = await prisma.aidOffer.findMany({
      where: {
        expiresAt: { not: null },
        status: { in: ['OFFERED', 'AVAILABLE'] },
        aidType: {
          isPerishable: true,
        },
      },
      include: {
        aidType: true,
      },
    });

    let updatedOffers = 0;
    let expiredOffers = 0;

    for (const offer of perishableOffers) {
      if (isExpired(offer.expiresAt, now)) {
        // Mark as expired
        await prisma.aidOffer.update({
          where: { id: offer.id },
          data: {
            status: 'EXPIRED',
          },
        });
        expiredOffers++;
      }
      // Note: Offers don't have urgency field in current schema, but we can add it if needed
    }

    return {
      success: true,
      updatedRequests,
      expiredRequests,
      updatedOffers,
      expiredOffers,
      timestamp: now,
    };
  } catch (error) {
    console.error('Error updating food urgency:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get time remaining until expiration in human-readable format
 * @param {Date} expiresAt - Expiration date
 * @param {Date} now - Current date
 * @returns {string} Human-readable time remaining
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

/**
 * Auto-set urgency when creating/updating a request with perishable food
 * @param {object} requestData - Request data
 * @returns {object} Request data with auto-set urgency
 */
export const autoSetFoodUrgency = (requestData) => {
  if (requestData.isPerishable && requestData.expiresAt) {
    // Auto-set urgency based on expiration date
    requestData.urgency = calculateFoodUrgency(requestData.expiresAt);
  } else if (requestData.aidTypeId) {
    // If aid type is FOOD_URGENT, set default urgency
    // This will be handled in the controller by checking aidType
  }
  
  return requestData;
};

