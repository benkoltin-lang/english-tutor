// تحسينات تفاعلية للنموذج
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من رقم الهاتف (تنسيق جزائري)
    const phoneInput = document.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // السماح فقط بالأرقام
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 15) {
                this.value = this.value.slice(0, 15);
            }
        });
    }

    // إظهار رسائل تنبيه عند اختيار الخدمات
    const serviceSelect = document.querySelector('select[name="serviceType"]');
    const studyModeSelect = document.querySelector('select[name="studyMode"]');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const selected = this.value;
            if (selected === 'programming') {
                alert('💻 دورات البرمجة متاحة للمبتدئين – سنتواصل معك لتحديد المستوى المناسب.');
            } else if (selected === 'cybersecurity') {
                alert('🔐 دورات الأمن السيبراني تتطلب معرفة أساسية بـ Linux – سنرسل لك المواد التمهيدية.');
            }
        });
    }

    // إضافة تأكيد قبل الإرسال (اختياري)
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const checkboxes = document.querySelectorAll('input[name="preferredTime"]:checked');
            if (checkboxes.length === 0) {
                e.preventDefault();
                alert('⚠️ يرجى تحديد وقت مناسب لك على الأقل.');
                return false;
            }
            // يمكن إضافة تنبيه تأكيد
            if (!confirm('هل أنت متأكد من صحة البيانات المدخلة؟')) {
                e.preventDefault();
                return false;
            }
        });
    }
});
