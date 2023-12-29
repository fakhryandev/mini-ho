const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TypeSchema = new Schema(
  {
    unitType: {
      type: String,
    },
    unitName: {
      type: String,
    },
    marketName: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: false,
    },
  }
);

const Type = mongoose.model('Type', TypeSchema);

module.exports = Type;
