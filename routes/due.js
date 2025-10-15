const express = require('express');
const router = express.Router();
const { Donor, Donation } = require('../models');

router.get('/', async (req, res) => {
  try {
    const month = req.query.month;
    if (!month) return res.status(400).json({ error: 'month query param required (YYYY-MM)' });

    const donors = await Donor.find();
    const due = [];
    for (const d of donors) {
      const paid = await Donation.findOne({ donorId: d._id, month_year: month });
      if (!paid) due.push({ id: d._id, name: d.name, phone: d.phone, book_no: d.book_no });
    }
    res.json(due);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
