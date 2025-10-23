const express = require('express');
const router = express.Router();
const { Donor } = require('../models');
const sendSMS = require('../twilioService');

router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find().sort({ name: 1 });
    res.json(donors);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, phone, book_no, address } = req.body;
    const donor = new Donor({ name, phone, book_no, address });
    await donor.save();

    // ✅ SMS পাঠানো
    if (donor.phone) {
      const message = `প্রিয় ${donor.name}, ধন্যবাদ! আপনি দাতা হিসেবে সফলভাবে যুক্ত হয়েছেন।`;
      await sendSMS(`+88${donor.phone}`, message);
      alert('SMS sent successfully');
    }

    res.json(donor);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
