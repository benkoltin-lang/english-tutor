const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Setting = require('../models/Setting');
const adminAuth = require('../middleware/auth');

router.get('/admin', adminAuth, async (req, res) => {
  const data = await Registration.find().sort({ registeredAt: -1 });
  const s = await Setting.findOne({ key: 'ticker' });
  res.render('admin', { registrations: data, total: data.length, tickerText: s ? s.value : '' });
});

// 💾 حفظ الشريط المتحرك
router.post('/update-ticker', adminAuth, async (req, res) => {
  const text = (req.body.tickerText || '').trim();
  await Setting.findOneAndUpdate({ key: 'ticker' }, { value: text }, { upsert: true });
  res.redirect('/admin');
});

router.get('/export-csv', adminAuth, async (req, res) => {
  const data = await Registration.find().sort({ registeredAt: -1 });
  const levelMap = {'primary_3':'3 ابتدائي','primary_4':'4 ابتدائي','primary_5':'5 ابتدائي','middle_1':'1 متوسط','middle_2':'2 متوسط','middle_3':'3 متوسط','middle_4':'4 متوسط'};
  let csv = 'الاسم,الهاتف,المستوى,طريقة الدراسة,التوقيت,ملاحظات,تاريخ التسجيل\n';
  data.forEach(item => {
    csv += `${item.firstName} ${item.lastName},${item.phone},${levelMap[item.level]||item.level},${item.studyMode==='in_person'?'حضوري':'عن بُعد'},"${item.scheduledAt||''}","${item.notes||''}",${item.registeredAt.toISOString()}\n`;
  });
  res.header('Content-Type', 'text/csv; charset=utf-8');
  res.attachment('registrations.csv');
  res.send('\ufeff' + csv);
});

router.post('/update-time/:id', adminAuth, async (req, res) => {
  await Registration.findByIdAndUpdate(req.params.id, { scheduledAt: req.body.scheduledAt });
  res.redirect('/admin');
});

router.post('/delete/:id', adminAuth, async (req, res) => {
  await Registration.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

router.get('/clear', adminAuth, async (req, res) => {
  await Registration.deleteMany({});
  res.redirect('/admin');
});

module.exports = router;
