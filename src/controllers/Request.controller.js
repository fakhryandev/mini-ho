const Request = require('../models/Request');
const { generator } = require('../utils/report-generator');
const { convertToDate, formatDate } = require('../utils/convert-date');
const { validatePartsRequest } = require('../utils/parts-validator');
const Type = require('../models/Type');
const Part = require('../models/Part');
const { axGenerator } = require('../utils/ax-generator');

const getRequestTwoMonthsAgo = async ({ nik, noka }) => {
  try {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setUTCHours(0, 0, 0, 0);
    twoMonthsAgo.setUTCMonth(twoMonthsAgo.getUTCMonth() - 2);

    const result = Request.find({
      create_at: {
        $gte: twoMonthsAgo,
        $lte: new Date(),
      },
      nik,
      noka,
    });

    return result;
  } catch (error) {
    res.json({
      error: true,
    });
  }
};

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

    const parsedParts = JSON.parse(parts);
    const partsArr = parsedParts
      .map((item) => item.partNumber.trim().toUpperCase())
      .filter((item) => item != '');

    const existType = await Type.find({ unitType: type });

    if (!existType.length) {
      throw new Error('Type motor tidak terdaftar di database');
    }

    const resultParts = await Part.find({ partNumber: { $in: partsArr } });
    const foundParts = resultParts.map((part) => part.partNumber);
    const missingParts = partsArr.filter((part) => !foundParts.includes(part));

    if (missingParts.length) {
      throw new Error(`Part berikut tidak ditemukan ${missingParts}`);
    }

    const partQtyError = [];
    resultParts.forEach((part) => {
      const inputQty = parsedParts.find(
        (item) => item.partNumber === part.partNumber
      )?.qty;
      if (inputQty && inputQty > part.maxQty) {
        partQtyError.push(
          `Part berikut ${part.partNumber} melebihi maksimal order yang terdaftar pada db ${part.maxQty}`
        );
      }
    });

    if (partQtyError.length) {
      console.log(partQtyError);
      throw new Error(partQtyError.join(' , '));
    }

    const twoMonthsAgoRequest = await getRequestTwoMonthsAgo({
      noka: noka.toUpperCase(),
      nik,
    });

    const isValid = validatePartsRequest({
      data: twoMonthsAgoRequest,
      partsArr,
    });

    if (!isValid) {
      throw new Error(
        'Terdapat permintaan part yang sama dalam dua bulan terakhir'
      );
    }

    const user = res.locals.currentUser;

    const requestPart = new Request({
      erro: user.erro,
      nomor_request: req.runningNumber,
      nomor_kuitansi: nomor,
      nik,
      nama,
      alamat,
      telepon,
      kota,
      noka: noka.toUpperCase(),
      nosin,
      type,
      tahun,
      parts: partsArr.map((partNumber) => ({
        partNumber: partNumber.toUpperCase(),
        qty: 1,
      })),
      ktp: {
        path: ktp.path,
      },
      stnk: {
        path: stnk.path,
      },
      kode3: user.kode3,
      kodeax5: user.kodeax5,
      kodeax9: user.kodeax9,
      noAhass: user.noAhass,
      create_by: user.username,
    });

    await requestPart.save();

    res.status(201).json({
      error: false,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      error: true,
      message: error.message,
    });
  }
};

exports.getRequestParts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const user = res.locals.currentUser;

    let requestParts = [];

    if (user.isAdmin) {
      requestParts = await Request.find({
        create_at: {
          $gte: convertToDate(startDate, 'T00:00:01'),
          $lte: convertToDate(endDate, 'T23:59:59'),
        },
      });
    } else {
      requestParts = await Request.find({
        create_at: {
          $gte: convertToDate(startDate, 'T00:00:01'),
          $lte: convertToDate(endDate, 'T23:59:59'),
        },
        erro: user.erro,
      });
    }

    const formattedData = requestParts.reduce((accumulator, item) => {
      item._doc.parts.forEach((part) => {
        accumulator.push({
          ...item._doc,
          part: part.partNumber,
          create_at: formatDate(item._doc.create_at),
        });
      });

      return accumulator;
    }, []);

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
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${startDate}-${endDate}_RequestPart.xlsx`
    );

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

exports.generateAX = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const requestParts = await Request.find({
      create_at: {
        $gte: convertToDate(startDate, 'T00:00:01'),
        $lte: convertToDate(endDate, 'T23:59:59'),
      },
    });

    const formattedData = requestParts.reduce((accumulator, item) => {
      item._doc.parts.forEach((part) => {
        accumulator.push({
          ...item._doc,
          part: part.partNumber,
          qty: part.qty,
          create_at: formatDate(item._doc.create_at),
        });
      });

      return accumulator;
    }, []);

    const generatedFile = axGenerator(formattedData);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${startDate}-${endDate}_POERRO.xlsx`
    );

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
