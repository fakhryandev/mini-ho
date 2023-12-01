const Request = require('../models/Request');
const { generator } = require('../utils/report-generator');
const { convertToDate, formatDate } = require('../utils/convert-date');

exports.addRequestParts = async (req, res) => {
  try {
    const {
      nomor,
      nik,
      nama,
      alamat,
      telepon,
      kota,
      noka,
      nosin,
      type,
      tahun,
      parts,
    } = req.body;

    const ktp = req.files['ktp'][0];
    const stnk = req.files['stnk'][0];

    const partsArr = parts
      .split(';')
      .map((item) => item.trim())
      .filter((item) => item != '');

    const user = res.locals.currentUser;

    const requestPart = new Request({
      erro: user.erro,
      nomor,
      nik,
      nama,
      alamat,
      telepon,
      kota,
      noka,
      nosin,
      type,
      tahun,
      parts: partsArr.map((partNumber) => ({ partNumber, qty: 1 })),
      ktp: {
        path: ktp.path,
      },
      stnk: {
        path: stnk.path,
      },
      create_by: user.username,
    });

    await requestPart.save();

    res.status(201).json({
      error: false,
    });
  } catch (error) {
    res.json({
      error: true,
      message: error.message,
    });
  }
};

exports.getRequestParts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const requestParts = await Request.find({
      create_at: {
        $gte: convertToDate(startDate, 'T00:00:01'),
        $lte: convertToDate(endDate, 'T23:59:59'),
      },
    });

    const formattedData = requestParts.map((item) => ({
      ...item._doc,
      create_at: formatDate(item._doc.create_at),
    }));
    res.json(formattedData);
  } catch (error) {
    res.json({
      error: true,
    });
  }
};

exports.generateReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const requestParts = await Request.find({
      create_at: {
        $gte: convertToDate(startDate, 'T00:00:01'),
        $lte: convertToDate(endDate, 'T23:59:59'),
      },
    });

    const generatedFile = generator(requestParts);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=${startDate}-${endDate}_RequestPart.xlsx`);

    generatedFile.xlsx
      .write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error('Gagal menulis ke response', error);
        res.status(500).send('Internal Server Error');
      });
  } catch (error) {
    res.json({
      error: true,
    });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const photoData = await Request.findOne({
      $or: [
        {
          'stnk.url': req.params.urlphoto,
        },
        {
          'ktp.url': req.params.urlphoto,
        },
      ],
    });

    if (!photoData) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    const filePath =
      req.params.urlphoto === photoData.stnk.url
        ? photoData.stnk.path
        : photoData.ktp.path;

    res.sendFile(filePath);
  } catch (error) {
    console.error('Gagal meng-handle permintaan file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
