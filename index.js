// โหลด environment variables จาก .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// ✅ Import service account JSON สำหรับ Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

// ✅ Initialize Firebase Admin SDK

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // ...อื่น ๆ
});

// ✅ สร้าง Express app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Import routes
const registerRoute = require('./routes/register');
const announcementRoute = require('./routes/announcement');

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('✅ Server is running!');
});

// ✅ API Routes
app.use('/api/register', registerRoute);
app.use('/api/announcements', announcementRoute);

// ✅ แสดงสถานะของ Environment Variables
console.log('🔎 ENV Loaded:', {
  CHANNEL_ACCESS_TOKEN: process.env.CHANNEL_ACCESS_TOKEN ? '✅' : '❌',
  RICH_MENU_RESIDENT: process.env.RICH_MENU_RESIDENT ? '✅' : '❌',
  RICH_MENU_TECHNICIAN: process.env.RICH_MENU_TECHNICIAN ? '✅' : '❌',
});

// ✅ จัดการ Error ไม่ให้เซิร์ฟเวอร์ crash
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// ✅ Start server
const PORT = process.env.PORT || 5001;
console.log('🚀 Starting server on PORT:', PORT);

app.listen(PORT, () => {
  console.log(`✅ Backend running at: http://localhost:${PORT}`);
});
