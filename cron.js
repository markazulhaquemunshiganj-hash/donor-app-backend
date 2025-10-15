// Cron job: daily due check and Twilio WhatsApp reminders
const cron = require('node-cron');
const { Donor, Donation } = require('./models');
const twilio = require('twilio');
require('dotenv').config();

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

let client = null;
if (TWILIO_SID && TWILIO_TOKEN) {
  client = twilio(TWILIO_SID, TWILIO_TOKEN);
}

async function sendWhatsApp(to, body) {
  if (!client || !TWILIO_NUMBER) throw new Error('Twilio not configured');
  return client.messages.create({ from: `whatsapp:${TWILIO_NUMBER}`, to: `whatsapp:${to}`, body });
}

function startCron() {
  cron.schedule('0 3 * * *', async () => {
    console.log('Running due-check cron...');
    try {
      const now = new Date();
      const monthYear = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
      const donors = await Donor.find();
      for (const d of donors) {
        const paid = await Donation.findOne({ donorId: d._id, month_year: monthYear });
        if (!paid) {
          const message = `আসসালামু আলাইকুম ${d.name}, আপনি ${monthYear} মাসের দান এখনও দেননি। অনুগ্রহ করে দ্রুত জমা দিন। ধন্যবাদ।`;
          try {
            await sendWhatsApp(d.phone, message);
            console.log('sent to', d.phone);
          } catch (err) {
            console.error('twilio error', err.message);
          }
        }
      }
    } catch (e) {
      console.error('cron error', e.message);
    }
  });
}

module.exports = { startCron };
