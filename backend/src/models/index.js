const User = require('./User');
const Subscription = require('./Subscription');

// Define associations
User.hasOne(Subscription, { 
  foreignKey: 'userId',
  as: 'subscription'
});

Subscription.belongsTo(User, { 
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  User,
  Subscription
};
