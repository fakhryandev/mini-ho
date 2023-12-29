const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartSchema = new Schema(
  {
    partNumber: {
      type: String,
    },
    partName: {
      type: String,
    },
    maxQty: {
      type: Number,
    },
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: false,
    },
  }
);

const Part = mongoose.model('Part', PartSchema);

module.exports = Part;
