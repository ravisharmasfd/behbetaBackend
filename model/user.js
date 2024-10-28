const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    trim: true,
    default:""
  },
  last_name: {
    type: String,
    default:"",
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    required: true // 1 for admin 2 for merchant
  },
  countryCode:{
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: 1
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
  },
  registeredName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 40,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  region: {
    type: String,
    required: true,
    trim: true,
  },
  tradeLicenseNo: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  iban: {
    type: String,
    required: true,
    maxlength: 34,
    trim: true,
  },
  merchantId: {
    type: String,
    required: true,
    maxlength: 40,
    unique:true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 25,
  },
  username: {
    type: String,
    required: true,
    unique:true,
    maxlength: 35,
  },
  category: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    default: null,
  },
  instagramUrl: {
    type: String,
    default: null,
  },
  facebookUrl: {
    type: String,
    default: null,
  },
  apiKey: {
    type: String,
    required: true,
  },
  isDeleted:{
    type: Boolean,
    default:false,
  }
}, { timestamps: true });

// Password hashing before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
