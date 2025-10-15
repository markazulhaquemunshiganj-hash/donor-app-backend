// Mongoose schemas: Donor, Donation
const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  book_no: { type: String },
  address: { type: String },
  created_at: { type: Date, default: Date.now }
});

const donationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor', required: true },
  amount: { type: Number, required: true },
  payment_date: { type: Date },
  receipt_no: { type: String },
  month_year: { type: String, required: true }, // e.g. '2025-10'
  created_at: { type: Date, default: Date.now }
});

const Donor = mongoose.model('Donor', donorSchema);
const Donation = mongoose.model('Donation', donationSchema);

module.exports = { Donor, Donation };
