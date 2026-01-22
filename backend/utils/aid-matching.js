// Aid Matching Logic
// Matches aid offers to requests based on various criteria

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Find matching offers for a request
 * @param {string} requestId - Request ID
 * @returns {Promise<Array>} Array of matching offers
 */
export const findMatchingOffers = async (requestId) => {
  try {
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        aidType: true,
      },
    });

    if (!request || !request.aidTypeId) {
      return [];
    }

    // Build matching criteria
    const where = {
      status: 'AVAILABLE',
      aidTypeId: request.aidTypeId,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    };

    // Quantity matching - offer must meet or exceed request quantity
    if (request.quantity) {
      where.OR = [
        ...where.OR,
        { quantity: { gte: request.quantity } },
        { quantity: null }, // Offers without quantity restriction
      ];
    }

    // Location matching (if both have locations)
    if (request.location) {
      // Simple location matching - can be enhanced with geolocation
      // For now, we'll include location as a preference but not requirement
    }

    // Find matching offers
    const offers = await prisma.aidOffer.findMany({
      where,
      include: {
        aidType: true,
        provider: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
      orderBy: [
        // Prioritize:
        // 1. Offers that can deliver
        { canDeliver: 'desc' },
        // 2. Offers with matching quantity
        { quantity: 'asc' },
        // 3. Newer offers first
        { createdAt: 'desc' },
      ],
      take: 10, // Top 10 matches
    });

    // Score and rank matches
    const scoredOffers = offers.map(offer => ({
      ...offer,
      matchScore: calculateMatchScore(request, offer),
    }));

    // Sort by match score
    scoredOffers.sort((a, b) => b.matchScore - a.matchScore);

    return scoredOffers;
  } catch (error) {
    console.error('Error finding matching offers:', error);
    return [];
  }
};

/**
 * Calculate match score between request and offer
 * Higher score = better match
 */
function calculateMatchScore(request, offer) {
  let score = 0;

  // Exact aid type match (base score)
  if (request.aidTypeId === offer.aidTypeId) {
    score += 100;
  }

  // Quantity match
  if (request.quantity && offer.quantity) {
    const quantityRatio = Math.min(offer.quantity / request.quantity, 1);
    score += quantityRatio * 50;
  }

  // Urgency match
  if (request.urgency === 'URGENT' && offer.aidType?.isPerishable) {
    score += 30;
  }

  // Delivery capability
  if (offer.canDeliver) {
    score += 20;
  }

  // Location proximity (simple - can be enhanced)
  if (request.location && offer.location) {
    if (request.location.toLowerCase().includes(offer.location.toLowerCase()) ||
        offer.location.toLowerCase().includes(request.location.toLowerCase())) {
      score += 15;
    }
  }

  // Expiration urgency (for perishable)
  if (request.expiresAt && offer.expiresAt) {
    const requestExpiry = new Date(request.expiresAt);
    const offerExpiry = new Date(offer.expiresAt);
    const now = new Date();

    // Both expire soon - high priority
    if (requestExpiry.getTime() - now.getTime() < 24 * 60 * 60 * 1000 &&
        offerExpiry.getTime() - now.getTime() < 24 * 60 * 60 * 1000) {
      score += 25;
    }
  }

  return score;
}

/**
 * Auto-match urgent/perishable requests
 * Called by cron job or admin action
 */
export const autoMatchUrgentRequests = async () => {
  try {
    // Find urgent requests that are verified but not matched
    const urgentRequests = await prisma.request.findMany({
      where: {
        status: 'VERIFIED',
        urgency: 'URGENT',
        OR: [
          { isPerishable: true },
          { expiresAt: { lte: new Date(Date.now() + 24 * 60 * 60 * 1000) } }, // Expires in 24h
        ],
      },
      include: {
        aidType: true,
      },
    });

    const matches = [];

    for (const request of urgentRequests) {
      const matchingOffers = await findMatchingOffers(request.id);

      if (matchingOffers.length > 0) {
        // Auto-match top offer
        const topOffer = matchingOffers[0];

        await prisma.$transaction([
          prisma.aidOffer.update({
            where: { id: topOffer.id },
            data: {
              status: 'MATCHED',
              requestId: request.id,
              matchedAt: new Date(),
            },
          }),
          prisma.request.update({
            where: { id: request.id },
            data: {
              status: 'MATCHED',
              matchedAt: new Date(),
            },
          }),
        ]);

        matches.push({
          requestId: request.id,
          offerId: topOffer.id,
          score: topOffer.matchScore,
        });
      }
    }

    return matches;
  } catch (error) {
    console.error('Error in auto-match:', error);
    return [];
  }
};

/**
 * Check and expire old requests/offers
 */
export const expireOldItems = async () => {
  try {
    const now = new Date();

    // Expire requests
    const expiredRequests = await prisma.request.updateMany({
      where: {
        status: { in: ['VERIFIED', 'MATCHED'] },
        expiresAt: { lte: now },
      },
      data: {
        status: 'EXPIRED',
        expiredAt: now,
      },
    });

    // Expire offers
    const expiredOffers = await prisma.aidOffer.updateMany({
      where: {
        status: 'AVAILABLE',
        expiresAt: { lte: now },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    return {
      expiredRequests: expiredRequests.count,
      expiredOffers: expiredOffers.count,
    };
  } catch (error) {
    console.error('Error expiring items:', error);
    return { expiredRequests: 0, expiredOffers: 0 };
  }
};

