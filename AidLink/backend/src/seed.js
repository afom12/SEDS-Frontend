require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Request = require('./models/Request');
const Item = require('./models/Item');
const Donation = require('./models/Donation');

const ensureUser = async ({ email, username, fullName, password, role }) => {
  let user = await User.findOne({ email });
  if (user) {
    return user;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  user = await User.create({
    email,
    username,
    fullName,
    passwordHash,
    role,
    isVerified: true,
  });
  return user;
};

const seed = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aidlink.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'AidLink Admin';
  const donorEmail = process.env.DONOR_EMAIL || 'donor@aidlink.com';
  const donorPassword = process.env.DONOR_PASSWORD || 'donor123';
  const recipientEmail = process.env.RECIPIENT_EMAIL || 'recipient@aidlink.com';
  const recipientPassword = process.env.RECIPIENT_PASSWORD || 'recipient123';

  const admin = await ensureUser({
    email: adminEmail,
    username: 'admin',
    fullName: adminName,
    password: adminPassword,
    role: 'admin',
  });
  const donor = await ensureUser({
    email: donorEmail,
    username: 'donor',
    fullName: 'AidLink Donor',
    password: donorPassword,
    role: 'donor',
  });
  const recipient = await ensureUser({
    email: recipientEmail,
    username: 'recipient',
    fullName: 'AidLink Recipient',
    password: recipientPassword,
    role: 'recipient',
  });

  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    await Category.insertMany([
      { name: 'Food', description: 'Food and groceries' },
      { name: 'Clothing', description: 'Clothing and textiles' },
      { name: 'Medical', description: 'Medical assistance' },
      { name: 'Education', description: 'School supplies and fees' },
      { name: 'Shelter', description: 'Housing and shelter support' },
    ]);
  }

  const requestCount = await Request.countDocuments();
  if (requestCount === 0) {
    await Request.insertMany([
      {
        requestedBy: recipient._id,
        title: 'Emergency Medical Support',
        description: 'Urgent assistance needed for medical expenses.',
        category: 'Medical',
        urgency: 'high',
        status: 'approved',
        amountRequested: 20000,
        amountRaised: 5000,
        location: { city: 'Addis Ababa', country: 'Ethiopia' },
      },
      {
        requestedBy: recipient._id,
        title: 'School Supplies for Children',
        description: 'Support needed for books and uniforms.',
        category: 'Education',
        urgency: 'medium',
        status: 'approved',
        amountRequested: 8000,
        amountRaised: 0,
        location: { city: 'Adama', country: 'Ethiopia' },
      },
    ]);
  }

  const itemCount = await Item.countDocuments();
  if (itemCount === 0) {
    await Item.insertMany([
      {
        donorId: donor._id,
        title: 'Food Package',
        description: 'Rice, oil, and basic staples',
        category: 'Food',
        quantity: 5,
        status: 'approved',
        location: { city: 'Addis Ababa', country: 'Ethiopia' },
      },
      {
        donorId: donor._id,
        title: 'Winter Jackets',
        description: 'Warm jackets for adults and children',
        category: 'Clothing',
        quantity: 10,
        status: 'approved',
        location: { city: 'Adama', country: 'Ethiopia' },
      },
    ]);
  }

  const donationCount = await Donation.countDocuments();
  if (donationCount === 0) {
    const firstRequest = await Request.findOne().sort({ createdAt: 1 });
    if (firstRequest) {
      await Donation.create({
        donorId: donor._id,
        requestId: firstRequest._id,
        amount: 5000,
        anonymous: false,
        status: 'completed',
        receiptNumber: `AL-${Date.now().toString(36).toUpperCase()}-0001`,
      });
    }
  }

  console.log('Seed complete');
  console.log('Admin:', adminEmail, adminPassword);
  console.log('Donor:', donorEmail, donorPassword);
  console.log('Recipient:', recipientEmail, recipientPassword);

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});


