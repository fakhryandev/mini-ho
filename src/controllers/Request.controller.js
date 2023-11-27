const Request = require("../models/Request");
const { generator } = require("../utils/report-generator");
const { convertToDate, formatDate } = require("../utils/convert-date");

exports.addRequestParts = async (req, res, next) => {
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

    const ktp = req.files["ktp"][0];
    const stnk = req.files["stnk"][0];

    const partsArr = parts
      .split(";")
      .map((item) => item.trim())
      .filter((item) => item != "");

    const requestPart = new Request({
      erro: 1,
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
      ktp: ktp.path,
      stnk: stnk.path,
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

exports.getRequestParts = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const requestParts = await Request.find({
      create_at: {
        $gte: convertToDate(startDate, "T00:00:01"),
        $lte: convertToDate(endDate, "T23:59:59"),
      },
    });

    const formattedData = requestParts.map((item) => ({
      ...item._doc,
      create_at: formatDate(item._doc.create_at),
    }));
    res.json(formattedData);
  } catch (error) {
    next(error);
  }
};

exports.generateReport = async (req, res, next) => {
  try {
    const requestParts = await Request.find({});
    const generatedFile = generator(requestParts);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=output.xlsx");

    generatedFile.xlsx
      .write(res)
      .then(() => {
        res.end();
      })
      .catch((error) => {
        console.error("Gagal menulis ke response", error);
        res.status(500).send("Internal Server Error");
      });
  } catch (error) {
    next(error);
  }
};
