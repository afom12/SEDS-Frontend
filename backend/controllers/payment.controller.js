import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create payment intent (Stripe)
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { donationId, paymentMethod = 'STRIPE' } = req.body;

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        request: true,
      },
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        error: 'Donation not found.',
      });
    }

    if (donation.donorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    if (donation.paymentStatus !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: 'Payment already processed.',
      });
    }

    if (paymentMethod === 'STRIPE') {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(donation.amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          donationId: donation.id,
          requestId: donation.requestId,
          donorId: donation.donorId,
        },
      });

      // Update donation with transaction info
      await prisma.donation.update({
        where: { id: donationId },
        data: {
          transactionId: paymentIntent.id,
          paymentMethod: 'STRIPE',
        },
      });

      res.json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
        },
      });
    } else if (paymentMethod === 'CHAPA') {
      // Chapa integration would go here
      // For now, return placeholder
      res.json({
        success: true,
        message: 'Chapa integration coming soon.',
        data: {
          paymentMethod: 'CHAPA',
          donationId,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment method.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// Confirm payment
export const confirmPayment = async (req, res, next) => {
  try {
    const { donationId, paymentIntentId } = req.body;

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        request: true,
      },
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        error: 'Donation not found.',
      });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update donation status
      const updatedDonation = await prisma.donation.update({
        where: { id: donationId },
        data: {
          paymentStatus: 'COMPLETED',
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          donationId: donation.id,
          gateway: 'STRIPE',
          gatewayTxId: paymentIntent.id,
          amount: donation.amount,
          status: 'COMPLETED',
          completedAt: new Date(),
          gatewayResponse: paymentIntent,
        },
      });

      // Update request progress
      const newCurrentAmount = donation.request.currentAmount + donation.amount;
      const progress = Math.min(100, (newCurrentAmount / donation.request.amount) * 100);

      await prisma.request.update({
        where: { id: donation.requestId },
        data: {
          currentAmount: newCurrentAmount,
          progress,
          status: progress >= 100 ? 'FUNDED' : donation.request.status,
          fundedAt: progress >= 100 ? new Date() : donation.request.fundedAt,
        },
      });

      res.json({
        success: true,
        message: 'Payment confirmed successfully.',
        data: updatedDonation,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment not completed.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// Handle Stripe webhook
export const handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// Handle Chapa webhook (placeholder)
export const handleChapaWebhook = async (req, res, next) => {
  // Chapa webhook implementation would go here
  res.json({ received: true });
};

// Get payment status
export const getPaymentStatus = async (req, res, next) => {
  try {
    const { donationId } = req.params;

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        transaction: true,
      },
    });

    if (!donation) {
      return res.status(404).json({
        success: false,
        error: 'Donation not found.',
      });
    }

    if (donation.donorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    res.json({
      success: true,
      data: {
        paymentStatus: donation.paymentStatus,
        transaction: donation.transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
async function handlePaymentSuccess(paymentIntent) {
  const donationId = paymentIntent.metadata?.donationId;

  if (!donationId) return;

  const donation = await prisma.donation.findUnique({
    where: { id: donationId },
    include: { request: true },
  });

  if (!donation || donation.paymentStatus === 'COMPLETED') return;

  await prisma.$transaction([
    prisma.donation.update({
      where: { id: donationId },
      data: { paymentStatus: 'COMPLETED' },
    }),
    prisma.transaction.upsert({
      where: { donationId },
      create: {
        donationId,
        gateway: 'STRIPE',
        gatewayTxId: paymentIntent.id,
        amount: donation.amount,
        status: 'COMPLETED',
        completedAt: new Date(),
        gatewayResponse: paymentIntent,
      },
      update: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    }),
    prisma.request.update({
      where: { id: donation.requestId },
      data: {
        currentAmount: {
          increment: donation.amount,
        },
      },
    }),
  ]);
}

async function handlePaymentFailure(paymentIntent) {
  const donationId = paymentIntent.metadata?.donationId;

  if (!donationId) return;

  await prisma.donation.update({
    where: { id: donationId },
    data: { paymentStatus: 'FAILED' },
  });
}

