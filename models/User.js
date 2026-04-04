const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  balance: {
    btc: { type: Number, default: 0 },
    eth: { type: Number, default: 0 },
    usdt: { type: Number, default: 0 }
  },
  totalBalance: {
    type: Number,
    default: 0
  },
  profit: {
    type: Number,
    default: 0
  },
  resetOTP: {
    type: String
  },
  otpExpiry: {
    type: Date
  },
  country: {
    type: String,
    trim: true
  },
  idType: {
    type: String,
    trim: true
  },
  profilePic: {
    type: String
  },
  isKycVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);