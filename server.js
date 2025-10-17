const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();



const donorsRoute = require('./routes/donors');
const donationsRoute = require('./routes/donations');
const dueRoute = require('./routes/due');
const { startCron } = require('./cron');

const app = express();
app.use(cors({
  origin: "*", // সব ডোমেইনকে অনুমতি দিচ্ছে
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(bodyParser.json());

app.use('/api/donors', donorsRoute);
app.use('/api/donations', donationsRoute);
app.use('/api/due', dueRoute);

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/donorapp';
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`✅ Server started successfully on port ${PORT}`));
    startCron();
  } catch (e) {
    console.error('Start error', e.message);
    process.exit(1);
  }
})();
