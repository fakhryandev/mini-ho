const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RunningNumberSchema = new Schema({
  runningNumber: { type: String, required: true },
});

const RunningNumber = mongoose.model('RunningNumber', RunningNumberSchema);

module.exports = RunningNumber;
