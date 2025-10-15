const express = require('express');
const router = express.Router();
const { Donation } = require('../models');

router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().populate('donorId').sort({ created_at: -1 });
    res.json(donations);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { donorId, amount, payment_date, receipt_no, month_year } = req.body;
    const don = new Donation({ donorId, amount, payment_date, receipt_no, month_year });
    await don.save();
    res.json(don);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
