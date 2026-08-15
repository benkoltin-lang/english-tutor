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
  const db = getDb();
  let regs = [], err = '';
  try {
    if (db) {
      const snap = await db.collection('registrations').orderBy('createdAt', 'desc').limit(100).get();
      snap.forEach(d => regs.push(Object.assign({ id: d.id }, d.data())));
    } else err = 'قاعدة البيانات غير موصولة';
  } catch (e) { err = e.message; }
  
  const rows = regs.map(r => `<tr>
    <td><b>${r.firstName} ${r.lastName}</b></td>
    <td dir="ltr">${r.phone}</td>
    <td>${r.level}</td>
    <td>${r.studyMode}</td>
    <td>${r.notes || '-'}</td>
    <td><small>${new Date(r.createdAt).toLocaleString('ar-DZ')}</small></td>
    <td>
      <form method="post" action="/admin/delete" style="display:inline">
        <input type="hidden" name="id" value="${r.id}">
        <button class="b-del" type="submit" onclick="return confirm('حذف هذا التسجيل؟')">🗑 حذف</button>
      </form>
    </td>
  </tr>`).join('');
  
  res.send(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>لوحة التحكم</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;font-family:sans-serif}
body{background:#0f2027;color:#fff;padding:15px}
h1{color:#f6c344;text-align:center;margin:15px 0}
table{width:100%;border-collapse:collapse;background:#16324a;border-radius:10px;overflow:hidden}
td,th{padding:10px;border-bottom:1px solid #234;text-align:right;font-size:14px}
th{background:#f6c344;color:#000}
.b-del{background:#7f1d1d;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer}
</style></head><body>
<h1>🔐 لوحة التحكم — تسجيلات الطلاب</h1>
${err ? '<p style="color:#e74c3c;text-align:center">❌ ' + err + '</p>' : ''}
<p style="text-align:center;margin:10px">عدد التسجيلات: <b style="color:#f6c344">${regs.length}</b></p>
<table>
<tr><th>الاسم</th><th>الهاتف</th><th>المستوى</th><th>الدراسة</th><th>ملاحظات</th><th>التاريخ</th><th>إجراء</th></tr>
${rows || '<tr><td colspan="7" style="text-align:center;padding:20px">لا توجد تسجيلات بعد</td></tr>'}
</table>
<p style="text-align:center;margin-top:15px"><a href="/" style="color:#4fc3f7">↩ العودة للموقع</a></p>
</body></html>`);
});

router.post('/admin/delete', auth, async (req, res) => {
  const db = getDb();
  if (db && req.body.id) {
    try {
      await db.collection('registrations').doc(req.body.id).delete();
    } catch (e) {
      console.error('خطأ الحذف:', e.message);
    }
  }
  res.redirect('/admin');
});

module.exports = router;
