const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB متصل بنجاح');
  } catch (error) {
    console.error('❌ فشل الاتصال بـ MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
