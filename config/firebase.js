const admin = require('firebase-admin');
let db = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(sa) });
    }
    db = admin.firestore();
    console.log('✅ Firebase جاهز');
  } else {
    console.log('⚠️ FIREBASE_SERVICE_ACCOUNT غير موجود');
  }
} catch (e) {
  console.error('❌ Firebase:', e.message);
}
module.exports = () => db;
