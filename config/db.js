const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ MONGODB_URI غير موجود!');
      return;
    }
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log('✅ MongoDB متصل بنجاح');
  } catch (err) {
    console.error('❌ خطأ MongoDB:', err.message);
  }
};

module.exports = connectDB;
