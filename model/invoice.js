const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref:"User"
  },
  invoice_start_date: {
    type: Date,
    default: null, // Allows null values, similar to Sequelize
  },
  ending: {
    type: Date,
    default: null,
    
  },
  repeat_every: {
    type: Number,
    required: true,
    default: 0,
  },
  country_code: {
    type: String, // Changed to string to match multiple 'country_code' fields in the Sequelize model
    required: true,
    default: '',
  },
  occurrences: {
    type: String,
    default: '', // Keep this as a string to match the Sequelize schema
  },
  name: {
    type: String,
    required: true,
    default: '',
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
    min:1,
  },
  mobile_no: {
    type: String,
    required: true,
    default: '',
  },
  remark: {
    type: String,
    required: true,
    default: '', // Kept as a string to follow your Sequelize structure
  },
  status: {
    type: Number,
    default: 1,

  },
  type: {
    type: Number,
    default: 1,
  },
  isDraft:{
    default: true,
    type: Boolean
  },
  isDeleted:{
    default: false,
    type: Boolean
  }
}, { 
  timestamps: true // This will automatically add createdAt and updatedAt fields
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
