const express = require('express');
const router = express.Router();
const getDb = require('../config/firebase');
const DEFAULT_TICKER = '⚡ خصم 20% للتسجيل المبكر|🏆 خبرة أكثر من 30 سنة|📚 دروس الإنجليزية لجميع المستويات|💻 حضوري أو عن بُعد|🎓 طرق تعليمية حديثة ومبسطة';

async function getTickerItems() {
  try {
    const db = getDb();
    if (db) {
      const doc = await db.collection('settings').doc('ticker').get();
      if (doc.exists) {
        const text = (doc.data().value || '').trim();
        if (text) return text.split('|').map(t => t.trim()).filter(t => t.length);
      }
    }
  } catch (e) { console.error('ticker:', e.message); }
  return DEFAULT_TICKER.split('|').map(t => t.trim()).filter(t => t.length);
}
function isValidName(n) { return /^[\u0600-\u06FFa-zA-Z\s]{2,50}$/.test(n.trim()); }
function isValidAlgerianPhone(p) { return /^(05|06|07)\d{8}$/.test(p); }

function notifyTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return;
  fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chat, text: text })
  }).catch(function (e) { console.error('tg:', e.message); });
}

router.get('/', async (req, res) => {
  res.render('index', { teacher: req.app.locals.teacher, success: false, studentName: '', error: '', tickerItems: await getTickerItems() });
});

router.post('/submit', async (req, res) => {
  const { firstName, lastName, phone, level, studyMode, notes } = req.body;
  const tickerItems = await getTickerItems();
  let error = '';
  if (!firstName || !lastName || !phone || !level || !studyMode) error = '⚠️ يرجى ملء جميع الحقول المطلوبة';
  else if (!isValidName(firstName)) error = '⚠️ الاسم الأول يجب أن يحتوي على حروف فقط';
  else if (!isValidName(lastName)) error = '⚠️ اللقب يجب أن يحتوي على حروف فقط';
  else if (!isValidAlgerianPhone(phone)) error = '⚠️ رقم الهاتف غير صحيح. يجب أن يبدأ بـ 05 أو 06 أو 07';
  if (!error) {
    try {
      const db = getDb();
      if (db) {
        await db.collection('registrations').add({
          firstName: firstName.trim(), lastName: lastName.trim(),
          phone: phone.trim(), level, studyMode,
          notes: notes ? notes.trim().slice(0, 500) : '',
          createdAt: Date.now()
        });
        notifyTelegram('📝 تسجيل جديد!\n👤 ' + firstName.trim() + ' ' + lastName.trim() + '\n📞 ' + phone.trim() + '\n🎓 ' + level + '\n📚 ' + studyMode);
      }
    } catch (e) { console.error('❌ حفظ:', e.message); }
  }
  res.render('index', {
    teacher: req.app.locals.teacher,
    success: !error,
    studentName: !error ? firstName.trim() + ' ' + lastName.trim() : '',
    error, tickerItems
  });
});
module.exports = router;
