require('dotenv').config();
const twilio = require('twilio');

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(to, message) {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: to
    });
    console.log('✅ SMS sent to:', to);
  } catch (error) {
    console.error('❌ SMS Error:', error.message);
  }
}

module.exports = sendSMS;
