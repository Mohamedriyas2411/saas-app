const mongoose = require('mongoose');const mongoose = require('mongoose');const mongoose = require('mongoose');const { DataTypes } = require('sequelize');

const bcrypt = require('bcryptjs');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  firstName: {const bcrypt = require('bcryptjs');const { sequelize } = require('../config/database');

    type: String,

    required: [true, 'First name is required'],const userSchema = new mongoose.Schema({

    trim: true,

    maxLength: [50, 'First name cannot exceed 50 characters']  firstName: {const bcrypt = require('bcryptjs');

  },

  lastName: {    type: String,

    type: String,

    required: [true, 'Last name is required'],    required: [true, 'First name is required'],const userSchema = new mongoose.Schema({

    trim: true,

    maxLength: [50, 'Last name cannot exceed 50 characters']    trim: true,

  },

  email: {    maxLength: [50, 'First name cannot exceed 50 characters']  firstName: {const User = sequelize.define('User', {

    type: String,

    required: [true, 'Email is required'],  },

    unique: true,

    lowercase: true,  lastName: {    type: String,  id: {

    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']

  },    type: String,

  password: {

    type: String,    required: [true, 'Last name is required'],    required: [true, 'First name is required'],    type: DataTypes.INTEGER,

    required: [true, 'Password is required'],

    minLength: [6, 'Password must be at least 6 characters'],    trim: true,

    select: false

  },    maxLength: [50, 'Last name cannot exceed 50 characters']    trim: true,    primaryKey: true,

  isActive: {

    type: Boolean,  },

    default: true

  },  email: {    maxLength: [50, 'First name cannot exceed 50 characters']    autoIncrement: true

  emailVerified: {

    type: Boolean,    type: String,

    default: false

  },    required: [true, 'Email is required'],  },  },

  lastLoginAt: {

    type: Date,    unique: true,

    default: null

  }    lowercase: true,  lastName: {  email: {

}, {

  timestamps: true    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']

});

  },    type: String,    type: DataTypes.STRING,

// Virtual for full name

userSchema.virtual('fullName').get(function() {  password: {

  return `${this.firstName} ${this.lastName}`;

});    type: String,    required: [true, 'Last name is required'],    allowNull: false,



// Hash password before saving    required: [true, 'Password is required'],

userSchema.pre('save', async function(next) {

  if (!this.isModified('password')) return next();    minLength: [6, 'Password must be at least 6 characters'],    trim: true,    unique: true,

  

  try {    select: false

    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);  },    maxLength: [50, 'Last name cannot exceed 50 characters']    validate: {

    next();

  } catch (error) {  isActive: {

    next(error);

  }    type: Boolean,  },      isEmail: true

});

    default: true

// Compare password method

userSchema.methods.comparePassword = async function(candidatePassword) {  },  email: {    }

  return await bcrypt.compare(candidatePassword, this.password);

};  emailVerified: {



// Remove sensitive data from JSON output    type: Boolean,    type: String,  },

userSchema.methods.toJSON = function() {

  const user = this.toObject({ virtuals: true });    default: false

  delete user.password;

  delete user.__v;  },    required: [true, 'Email is required'],  password: {

  return user;

};  emailVerificationToken: {



module.exports = mongoose.model('User', userSchema);    type: String,    unique: true,    type: DataTypes.STRING,

    default: null

  },    lowercase: true,    allowNull: false,

  resetPasswordToken: {

    type: String,    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']    validate: {

    default: null

  },  },      len: [6, 100]

  resetPasswordExpires: {

    type: Date,  password: {    }

    default: null

  },    type: String,  },

  lastLoginAt: {

    type: Date,    required: [true, 'Password is required'],  firstName: {

    default: null

  }    minLength: [6, 'Password must be at least 6 characters'],    type: DataTypes.STRING,

}, {

  timestamps: true    select: false // Don't include password in queries by default    allowNull: false,

});

  },    validate: {

userSchema.virtual('fullName').get(function() {

  return `${this.firstName} ${this.lastName}`;  isActive: {      len: [1, 50]

});

    type: Boolean,    }

userSchema.pre('save', async function(next) {

  if (!this.isModified('password')) return next();    default: true  },

  

  try {  },  lastName: {

    const salt = await bcrypt.genSalt(12);

    this.password = await bcrypt.hash(this.password, salt);  emailVerified: {    type: DataTypes.STRING,

    next();

  } catch (error) {    type: Boolean,    allowNull: false,

    next(error);

  }    default: false    validate: {

});

  },      len: [1, 50]

userSchema.methods.comparePassword = async function(candidatePassword) {

  return await bcrypt.compare(candidatePassword, this.password);  emailVerificationToken: {    }

};

    type: String,  },

userSchema.methods.toJSON = function() {

  const user = this.toObject({ virtuals: true });    default: null  isActive: {

  delete user.password;

  delete user.emailVerificationToken;  },    type: DataTypes.BOOLEAN,

  delete user.resetPasswordToken;

  delete user.resetPasswordExpires;  resetPasswordToken: {    defaultValue: true

  delete user.__v;

  return user;    type: String,  },

};

    default: null  emailVerified: {

module.exports = mongoose.model('User', userSchema);
  },    type: DataTypes.BOOLEAN,

  resetPasswordExpires: {    defaultValue: false

    type: Date,  },

    default: null  emailVerificationToken: {

  },    type: DataTypes.STRING,

  lastLoginAt: {    allowNull: true

    type: Date,  },

    default: null  resetPasswordToken: {

  }    type: DataTypes.STRING,

}, {    allowNull: true

  timestamps: true // Automatically adds createdAt and updatedAt  },

});  resetPasswordExpires: {

    type: DataTypes.DATE,

// Virtual for full name    allowNull: true

userSchema.virtual('fullName').get(function() {  },

  return `${this.firstName} ${this.lastName}`;  lastLoginAt: {

});    type: DataTypes.DATE,

    allowNull: true

// Hash password before saving  }

userSchema.pre('save', async function(next) {}, {

  if (!this.isModified('password')) return next();  tableName: 'users',

    timestamps: true,

  try {  hooks: {

    const salt = await bcrypt.genSalt(12);    beforeCreate: async (user) => {

    this.password = await bcrypt.hash(this.password, salt);      if (user.password) {

    next();        user.password = await bcrypt.hash(user.password, 12);

  } catch (error) {      }

    next(error);    },

  }    beforeUpdate: async (user) => {

});      if (user.changed('password')) {

        user.password = await bcrypt.hash(user.password, 12);

// Compare password method      }

userSchema.methods.comparePassword = async function(candidatePassword) {    }

  return await bcrypt.compare(candidatePassword, this.password);  }

};});



// Remove sensitive data from JSON outputUser.prototype.comparePassword = async function(candidatePassword) {

userSchema.methods.toJSON = function() {  return bcrypt.compare(candidatePassword, this.password);

  const user = this.toObject({ virtuals: true });};

  delete user.password;

  delete user.emailVerificationToken;User.prototype.toJSON = function() {

  delete user.resetPasswordToken;  const values = { ...this.get() };

  delete user.resetPasswordExpires;  delete values.password;

  delete user.__v;  delete values.emailVerificationToken;

  return user;  delete values.resetPasswordToken;

};  delete values.resetPasswordExpires;

  return values;

module.exports = mongoose.model('User', userSchema);};

module.exports = User;
