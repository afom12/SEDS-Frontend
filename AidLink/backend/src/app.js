const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const donationRoutes = require('./routes/donationRoutes');
const transparencyRoutes = require('./routes/transparencyRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const itemRoutes = require('./routes/itemRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

const origins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      'https://localhost:5173',
      'https://127.0.0.1:5173',
      'https://localhost:5174',
      'https://127.0.0.1:5174',
    ];

app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);

app.get('/api/healthcheck', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/transparency', transparencyRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;

