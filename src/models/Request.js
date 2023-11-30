const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RequestSchema = new Schema(
  {
    erro: {
      type: String,
    },
    nomor: {
      type: String,
    },
    nik: {
      type: String,
    },
    nama: {
      type: String,
    },
    alamat: {
      type: String,
    },
    telepon: {
      type: String,
    },
    kota: {
      type: String,
    },
    noka: {
      type: String,
    },
    nosin: {
      type: String,
    },
    type: {
      type: String,
    },
    tahun: {
      type: String,
    },
    parts: [
      {
        partNumber: {
          type: String,
        },
        qty: {
          type: Number,
        },
      },
    ],
    ktp: {
      type: String,
    },
    stnk: {
      type: String,
    },
    create_by: {
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

const Request = mongoose.model('Request', RequestSchema);

module.exports = Request;
