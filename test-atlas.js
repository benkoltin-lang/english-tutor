const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;
console.log('🔎 فحص الرابط...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 12000 })
  .then(() => { console.log('✅ الاتصال بـ Atlas ناجح!'); process.exit(0); })
  .catch(e => { console.log('❌ الخطأ الحقيقي:', e.message); process.exit(1); });
