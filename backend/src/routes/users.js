const express = require('express');
const Joi = require('joi');
const { User, Subscription } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Validation schema
const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(50),
  lastName: Joi.string().min(1).max(50),
  email: Joi.string().email()
});

// GET /api/users/profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Subscription,
        as: 'subscription'
      }]
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/profile
router.put('/profile', async (req, res, next) => {
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }

    const { firstName, lastName, email } = req.body;
    
    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email,
          id: { [require('sequelize').Op.ne]: req.user.id }
        }
      });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;

    await req.user.update(updateData);

    const updatedUser = await User.findByPk(req.user.id, {
      include: [{
        model: Subscription,
        as: 'subscription'
      }]
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/account
router.delete('/account', async (req, res, next) => {
  try {
    // Soft delete by setting isActive to false
    await req.user.update({ isActive: false });

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
