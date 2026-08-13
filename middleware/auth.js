// Middleware مخصص للحماية (أبسط وأقوى من express-basic-auth)
function adminAuth(req, res, next) {
  const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';
  
  const authHeader = req.headers.authorization;
  
  // إذا لم يكن هناك header للمصادقة
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="AdminPanel"');
    return res.status(401).send(getLoginPage());
  }
  
  // فك تشفير بيانات الاعتماد
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
  const [username, password] = credentials.split(':');
  
  // التحقق من صحة البيانات
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return next(); // السماح بالمرور
  }
  
  // بيانات خاطئة - أعد عرض صفحة الدخول
  res.set('WWW-Authenticate', 'Basic realm="AdminPanel"');
  return res.status(401).send(getLoginPage('⚠️ اسم المستخدم أو كلمة المرور غير صحيحة'));
}

// صفحة تسجيل الدخول الجميلة
function getLoginPage(errorMsg = '') {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تسجيل الدخول - لوحة التحكم</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
        body {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #0b2a4a, #1b3a5c);
          padding: 20px;
        }
        .login-box {
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(18px);
          border-radius: 24px;
          padding: 40px 30px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,215,0,0.25);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        .login-box h1 {
          color: #f9d342;
          margin-bottom: 10px;
          font-size: 1.8rem;
        }
        .login-box p {
          color: #ddd;
          margin-bottom: 20px;
        }
        .error {
          background: rgba(231,76,60,0.2);
          border: 1px solid #e74c3c;
          color: #ff6b6b;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        .btn {
          display: inline-block;
          padding: 12px 30px;
          background: #3498db;
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          transition: 0.3s;
        }
        .btn:hover { background: #2980b9; }
        .lock-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <div class="login-box">
        <div class="lock-icon">🔒</div>
        <h1>منطقة محمية</h1>
        <p>الرجاء استخدام نافذة تسجيل الدخول في المتصفح</p>
        ${errorMsg ? `<div class="error">${errorMsg}</div>` : ''}
        <a href="/" class="btn">↩ العودة للرئيسية</a>
      </div>
    </body>
    </html>
  `;
}

module.exports = adminAuth;
