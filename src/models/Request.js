const mongoose = require('mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const RequestSchema = new Schema(
  {
    erro: {
      type: String,
    },
    nomor_request: {
      type: String,
    },
    nomor_kuitansi: {
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
    kode3: {
      type: String,
    },
    kodeax5: {
      type: String,
    },
    kodeax9: {
      type: String,

    },
    noAhass: {
      type: String,
    },
    ktp: {
      path: {
        type: String,
      },
      url: {
        type: String,
        unique: true,
      },
    },
    stnk: {
      path: {
        type: String,
      },
      url: {
        type: String,
        unique: true,
      },
    },
    kuitansi: {
      path: {
        type: String,
      },
      url: {
        type: String,
        unique: true,
      },
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

RequestSchema.pre('save', function (next) {
  this.stnk.url = `${Date.now()}-${uuid.v4()}`;
  this.ktp.url = `${Date.now()}-${uuid.v4()}`;
  this.kuitansi.url = `${Date.now()}-${uuid.v4()}`;
  next();
});

const Request = mongoose.model('Request', RequestSchema);

module.exports = Request;
