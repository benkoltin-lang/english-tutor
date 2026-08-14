const express = require('express');
const router = express.Router();
const getDb = require('../config/firebase');
const USER = process.env.ADMIN_USERNAME || 'admin';
const PASS = process.env.ADMIN_PASSWORD || 'admin123';

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  if (h.startsWith('Basic ')) {
    const [u, p] = Buffer.from(h.slice(6), 'base64').toString().split(':');
    if (u === USER && p === PASS) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="admin"');
  return res.status(401).send('مطلوب كلمة المرور');
}

router.get('/admin', auth, async (req, res) => {
  let rows = [], err = '';
  try {
    const db = getDb();
    if (db) {
      const snap = await db.collection('registrations').orderBy('createdAt', 'desc').limit(200).get();
      snap.forEach(d => rows.push(d.data()));
    } else err = 'قاعدة البيانات غير موصولة';
  } catch (e) { err = e.message; }
  const trs = rows.map(r => '<tr><td>' + (r.firstName||'') + ' ' + (r.lastName||'') + '</td><td dir="ltr">' + (r.phone||'') + '</td><td>' + (r.level||'') + '</td><td>' + (r.studyMode||'') + '</td><td>' + (r.notes||'') + '</td></tr>').join('');
  res.send('<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>لوحة التحكم</title><style>body{font-family:sans-serif;background:#0f2027;color:#fff;padding:20px}h1{color:#f6c344}table{width:100%;border-collapse:collapse;background:#16324a;border-radius:10px;overflow:hidden}td,th{padding:10px;border-bottom:1px solid #234;text-align:right;font-size:14px}th{background:#f6c344;color:#000}a{color:#4fc3f7}</style></head><body><h1>🔐 لوحة التحكم — تسجيلات الطلاب</h1>' + (err ? '<p style="color:#f66">❌ ' + err + '</p>' : '') + '<p>عدد التسجيلات: ' + rows.length + '</p>' + (rows.length ? '<table><tr><th>الاسم</th><th>الهاتف</th><th>المستوى</th><th>الدراسة</th><th>ملاحظات</th></tr>' + trs + '</table>' : '<p>لا توجد تسجيلات بعد.</p>') + '<p><a href="/">↩ العودة للموقع</a></p></body></html>');
});
module.exports = router;
