const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Setting = require('../models/Setting');

const DEFAULT_TICKER = '⚡ خصم 20% للتسجيل المبكر|🏆 خبرة أكثر من 30 سنة|📚 دروس الإنجليزية لجميع المستويات|💻 حضوري أو عن بُعد|🎓 طرق تعليمية حديثة ومبسطة';

async function getTickerItems() {
  try {
    const s = await Setting.findOne({ key: 'ticker' });
    const text = (s && s.value && s.value.trim()) ? s.value : DEFAULT_TICKER;
    return text.split('|').map(t => t.trim()).filter(t => t.length > 0);
  } catch (e) {
    return DEFAULT_TICKER.split('|');
  }
}

function isValidName(name) {
  return /^[\u0600-\u06FFa-zA-Z\s]{2,50}$/.test(name.trim());
}

function isValidAlgerianPhone(phone) {
  return /^(05|06|07)\d{8}$/.test(phone);
}

router.get('/', async (req, res) => {
  res.render('index', {
    teacher: req.app.locals.teacher,
    success: false,
    studentName: '',
    error: '',
    tickerItems: await getTickerItems()
  });
});

router.post('/submit', async (req, res) => {
  try {
    const { firstName, lastName, phone, level, studyMode, notes } = req.body;
    const tickerItems = await getTickerItems();

    let error = '';
    if (!firstName || !lastName || !phone || !level || !studyMode) {
      error = '⚠️ يرجى ملء جميع الحقول المطلوبة';
    } else if (!isValidName(firstName)) {
      error = '⚠️ الاسم الأول يجب أن يحتوي على حروف فقط بدون أرقام أو رموز';
    } else if (!isValidName(lastName)) {
      error = '⚠️ اللقب يجب أن يحتوي على حروف فقط بدون أرقام أو رموز';
    } else if (!isValidAlgerianPhone(phone)) {
      error = '⚠️ رقم الهاتف غير صحيح. يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام';
    }

    if (error) {
      return res.render('index', { teacher: req.app.locals.teacher, success: false, studentName: '', error, tickerItems });
    }

    await new Registration({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      level,
      studyMode,
      notes: notes ? notes.trim().slice(0, 500) : ''
    }).save();

    res.render('index', {
      teacher: req.app.locals.teacher,
      success: true,
      studentName: `${firstName.trim()} ${lastName.trim()}`,
      error: '',
      tickerItems
    });

  } catch (error) {
    console.error('❌ خطأ:', error);
    res.render('index', { teacher: req.app.locals.teacher, success: false, studentName: '', error: '❌ حدث خطأ، حاول مرة أخرى', tickerItems: await getTickerItems() });
  }
});

module.exports = router;
