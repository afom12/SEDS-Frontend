const path = require('path');

// 👇 Explicitly load .env from backend root
require('dotenv').config({
  path: path.resolve(__dirname, '.env'),
});

const app = require('./src/app');
const connectDB = require('./src/config/db');

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error', err);
    process.exit(1);
  });



