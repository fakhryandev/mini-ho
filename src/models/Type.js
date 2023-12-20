const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeSchema = new Schema({
  unitType: {
    type: String,
  },
  unitName: {
    type: String,
  }
});

const Type = mongoose.model('Type', TypeSchema);

module.exports = Type;
