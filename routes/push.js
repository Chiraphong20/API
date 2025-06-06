const express = require('express');
const axios = require('axios');
const router = express.Router();

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

router.post('/', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing userId or message' });
  }

  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: userId,
        messages: [{ type: 'text', text: message }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('❌ LINE Push Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Push failed' });
  }
});

module.exports = router;
