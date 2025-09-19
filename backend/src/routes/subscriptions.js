const express = require('express');
const Joi = require('joi');
const { Subscription, User } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Subscription plans (in a real app, these would be in a database)
const SUBSCRIPTION_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    features: ['Basic features', '5GB storage', 'Email support']
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    price: 29.99,
    features: ['All Basic features', '50GB storage', 'Priority support', 'Advanced analytics']
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 99.99,
    features: ['All Pro features', 'Unlimited storage', 'Phone support', 'Custom integrations']
  }
};

// Validation schemas
const createSubscriptionSchema = Joi.object({
  planId: Joi.string().valid(...Object.keys(SUBSCRIPTION_PLANS)).required()
});

// GET /api/subscriptions/plans
router.get('/plans', (req, res) => {
  res.json({ plans: Object.values(SUBSCRIPTION_PLANS) });
});

// GET /api/subscriptions/current
router.get('/current', async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.json({ subscription: null });
    }

    res.json({ subscription });
  } catch (error) {
    next(error);
  }
});

// POST /api/subscriptions/create
router.post('/create', async (req, res, next) => {
  try {
    const { error } = createSubscriptionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    const { planId } = req.body;
    const plan = SUBSCRIPTION_PLANS[planId];

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      where: { 
        userId: req.user.id,
        status: ['active', 'trialing']
      }
    });

    if (existingSubscription) {
      return res.status(409).json({ error: 'User already has an active subscription' });
    }

    // Create subscription with trial period
    const trialStart = new Date();
    const trialEnd = new Date(trialStart.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days trial

    const subscription = await Subscription.create({
      userId: req.user.id,
      planId: plan.id,
      planName: plan.name,
      status: 'trialing',
      currentPeriodStart: trialStart,
      currentPeriodEnd: trialEnd,
      trialStart,
      trialEnd
    });

    res.status(201).json({
      message: 'Subscription created successfully',
      subscription
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/subscriptions/upgrade
router.post('/upgrade', async (req, res, next) => {
  try {
    const { error } = createSubscriptionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    const { planId } = req.body;
    const plan = SUBSCRIPTION_PLANS[planId];

    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    if (subscription.status === 'canceled') {
      return res.status(400).json({ error: 'Cannot upgrade canceled subscription' });
    }

    // Update subscription
    await subscription.update({
      planId: plan.id,
      planName: plan.name,
      status: 'active'
    });

    res.json({
      message: 'Subscription upgraded successfully',
      subscription
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/subscriptions/cancel
router.post('/cancel', async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    if (subscription.status === 'canceled') {
      return res.status(400).json({ error: 'Subscription already canceled' });
    }

    // Cancel at period end
    await subscription.update({
      cancelAtPeriodEnd: true,
      canceledAt: new Date()
    });

    res.json({
      message: 'Subscription will be canceled at the end of the current period',
      subscription
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/subscriptions/reactivate
router.post('/reactivate', async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    if (!subscription.cancelAtPeriodEnd && subscription.status === 'active') {
      return res.status(400).json({ error: 'Subscription is already active' });
    }

    // Reactivate subscription
    await subscription.update({
      cancelAtPeriodEnd: false,
      canceledAt: null,
      status: 'active'
    });

    res.json({
      message: 'Subscription reactivated successfully',
      subscription
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
