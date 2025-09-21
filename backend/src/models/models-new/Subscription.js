const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise'],
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'paused', 'trial'],
    default: 'active'
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  stripeSubscriptionId: {
    type: String,
    default: null
  },
  stripePriceId: {
    type: String,
    default: null
  },
  trialStart: {
    type: Date,
    default: null
  },
  trialEnd: {
    type: Date,
    default: null
  },
  currentPeriodStart: {
    type: Date,
    default: Date.now
  },
  currentPeriodEnd: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date;
    }
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  features: {
    maxProjects: {
      type: Number,
      default: 1
    },
    maxUsers: {
      type: Number,
      default: 1
    },
    storageGB: {
      type: Number,
      default: 1
    },
    apiCalls: {
      type: Number,
      default: 1000
    },
    support: {
      type: String,
      enum: ['basic', 'priority', 'dedicated'],
      default: 'basic'
    }
  }
}, {
  timestamps: true
});

// Static method to get plan features
subscriptionSchema.statics.getPlanFeatures = function(plan) {
  const plans = {
    free: {
      maxProjects: 1,
      maxUsers: 1,
      storageGB: 1,
      apiCalls: 1000,
      support: 'basic'
    },
    basic: {
      maxProjects: 5,
      maxUsers: 5,
      storageGB: 10,
      apiCalls: 10000,
      support: 'basic'
    },
    pro: {
      maxProjects: 25,
      maxUsers: 25,
      storageGB: 100,
      apiCalls: 100000,
      support: 'priority'
    },
    enterprise: {
      maxProjects: -1, // unlimited
      maxUsers: -1,
      storageGB: 1000,
      apiCalls: 1000000,
      support: 'dedicated'
    }
  };
  
  return plans[plan] || plans.free;
};

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' || (this.status === 'trial' && new Date() < this.trialEnd);
};

// Method to check if in trial
subscriptionSchema.methods.isInTrial = function() {
  return this.status === 'trial' && new Date() < this.trialEnd;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);