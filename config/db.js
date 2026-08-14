const mongoose = require('mongoose');

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!process.env.MONGODB_URI) {
    console.log('⚠️ MONGODB_URI غير موجود');
    return null;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      maxPoolSize: 10
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error('❌ MongoDB:', e.message);
    cached.promise = null;
    return null;
  }
  return cached.conn;
}

module.exports = connectDB;
