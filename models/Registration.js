const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'الاسم الأول مطلوب'],
    trim: true,
    minlength: [2, 'الاسم قصير جداً'],
    maxlength: [50, 'الاسم طويل جداً'],
    validate: {
      validator: function(v) {
        return /^[\u0600-\u06FFa-zA-Z\s]+$/.test(v);
      },
      message: 'الاسم يجب أن يحتوي على حروف فقط'
    }
  },
  lastName: {
    type: String,
    required: [true, 'اللقب مطلوب'],
    trim: true,
    minlength: [2, 'اللقب قصير جداً'],
    maxlength: [50, 'اللقب طويل جداً'],
    validate: {
      validator: function(v) {
        return /^[\u0600-\u06FFa-zA-Z\s]+$/.test(v);
      },
      message: 'اللقب يجب أن يحتوي على حروف فقط'
    }
  },
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    match: [/^(05|06|07)\d{8}$/, 'رقم الهاتف الجزائري غير صحيح (يجب أن يبدأ بـ 05/06/07)'],
    unique: false
  },
  level: {
    type: String,
    required: [true, 'المستوى الدراسي مطلوب'],
    enum: {
      values: ['primary_3', 'primary_4', 'primary_5', 'middle_1', 'middle_2', 'middle_3', 'middle_4'],
      message: 'المستوى الدراسي غير صحيح'
    }
  },
  studyMode: {
    type: String,
    required: [true, 'طريقة الدراسة مطلوبة'],
    enum: {
      values: ['in_person', 'online'],
      message: 'طريقة الدراسة غير صحيحة'
    }
  },
  notes: {
    type: String,
    default: '',
    maxlength: [500, 'الملاحظات طويلة جداً']
  },
  scheduledAt: {
    type: String,
    default: 'يحدد لاحقاً'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

registrationSchema.index({ phone: 1 });
registrationSchema.index({ registeredAt: -1 });

module.exports = mongoose.model('Registration', registrationSchema);
