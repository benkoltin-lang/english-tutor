document.addEventListener('DOMContentLoaded', function() {
  // منع إدخال أحرف في رقم الهاتف
  const phoneInput = document.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      this.value = this.value.replace(/[^0-9]/g, '').slice(0, 15);
    });
  }

  // تأكيد قبل الإرسال
  const form = document.getElementById('registrationForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      if (!confirm('هل أنت متأكد من صحة البيانات المدخلة؟')) {
        e.preventDefault();
        return false;
      }
    });
  }
});
