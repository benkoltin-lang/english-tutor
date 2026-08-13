require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

const TEACHER = {
  name: process.env.TEACHER_NAME || 'عشي عبد العزيز',
  phone: process.env.TEACHER_PHONE || '0662177772',
  phone2: process.env.TEACHER_PHONE_2 || '0550040625',
  email: process.env.TEACHER_EMAIL || 'benkoltin@gmail.com'
};
app.locals.teacher = TEACHER;

connectDB();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

app.use('/', require('./routes/formRoutes'));
app.use('/', require('./routes/adminRoutes'));

app.use((err, req, res, next) => {
  console.error('❌ خطأ:', err);
  res.status(500).send('<div dir="rtl" style="text-align:center;padding:50px"><h1>❌ حدث خطأ</h1><p>' + err.message + '</p><a href="/">العودة للرئيسية</a></div>');
});

app.use((req, res) => res.status(404).send('الصفحة غير موجودة'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
});
