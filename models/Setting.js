const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: { type: String }
});

module.exports = mongoose.model('Setting', settingSchema);
