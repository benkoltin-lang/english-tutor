document.addEventListener('DOMContentLoaded', function() {
  
  // ===== 1) منع الأرقام والرموز في حقول الاسم =====
  const nameFields = document.querySelectorAll('input[name="firstName"], input[name="lastName"]');
  
  nameFields.forEach(function(field) {
    field.addEventListener('input', function(e) {
      // السماح فقط بالحروف العربية والإنجليزية والمسافات
      const value = this.value;
      const cleaned = value.replace(/[^\u0600-\u06FFa-zA-Z\s]/g, '');
      if (value !== cleaned) {
        this.value = cleaned;
        // تأثير بصري عند الحذف التلقائي
        this.style.outline = '2px solid #e74c3c';
        setTimeout(() => {
          this.style.outline = '2px solid transparent';
        }, 500);
      }
    });
  });
  
  // ===== 2) تقييد رقم الهاتف (جزائري فقط) =====
  const phoneInput = document.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      // السماح بالأرقام فقط، وإزالة أي شيء آخر
      let value = this.value.replace(/[^0-9]/g, '');
      
      // حد أقصى 10 أرقام (الهاتف الجزائري)
      if (value.length > 10) {
        value = value.slice(0, 10);
      }
      
      this.value = value;
      
      // التحقق من أن الرقم يبدأ بـ 05 أو 06 أو 07
      if (value.length >= 2) {
        const prefix = value.substring(0, 2);
        if (!['05', '06', '07'].includes(prefix)) {
          this.style.outline = '2px solid #e74c3c';
        } else {
          this.style.outline = '2px solid #2ecc71';
        }
      } else if (value.length > 0) {
        this.style.outline = '2px solid #f39c12'; // تحذير برتقالي
      } else {
        this.style.outline = '2px solid transparent';
      }
    });
    
    // التحقق عند ترك الحقل
    phoneInput.addEventListener('blur', function() {
      const value = this.value;
      if (value && !/^(05|06|07)\d{8}$/.test(value)) {
        this.setCustomValidity('رقم الهاتف يجب أن يبدأ بـ 05 أو 06 أو 07 ويتكون من 10 أرقام');
      } else {
        this.setCustomValidity('');
      }
    });
  }
  
  // ===== 3) التحقق قبل الإرسال =====
  const form = document.getElementById('registrationForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      // التحقق من الاسم الأول
      const firstName = document.querySelector('input[name="firstName"]').value;
      if (!/^[\u0600-\u06FFa-zA-Z\s]{2,50}$/.test(firstName.trim())) {
        e.preventDefault();
        alert('⚠️ الاسم الأول يجب أن يحتوي على حروف فقط (عربي/إنجليزي) بدون أرقام أو رموز');
        return false;
      }
      
      // التحقق من اللقب
      const lastName = document.querySelector('input[name="lastName"]').value;
      if (!/^[\u0600-\u06FFa-zA-Z\s]{2,50}$/.test(lastName.trim())) {
        e.preventDefault();
        alert('⚠️ اللقب يجب أن يحتوي على حروف فقط (عربي/إنجليزي) بدون أرقام أو رموز');
        return false;
      }
      
      // التحقق من الهاتف الجزائري
      const phone = document.querySelector('input[name="phone"]').value;
      if (!/^(05|06|07)\d{8}$/.test(phone)) {
        e.preventDefault();
        alert('⚠️ رقم الهاتف غير صحيح\nيجب أن يبدأ بـ 05 أو 06 أو 07\nويتكون من 10 أرقام');
        return false;
      }
      
      // تأكيد الإرسال
      if (!confirm('هل أنت متأكد من صحة البيانات المدخلة؟')) {
        e.preventDefault();
        return false;
      }
    });
  }
});
