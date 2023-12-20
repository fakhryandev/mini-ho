const xlsx = require('xlsx');
const Type = require('../models/Type');

exports.storeTypes = async (req, res) => {
  try {
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { raw: true });

    const batchSize = 10;
    const totalRows = data.length;


    for (let start = 0; start < totalRows; start += batchSize) {
      const end = Math.min(start + batchSize, totalRows);
      const batchData = data.slice(start, end);

      const filteredData = batchData
        .map((item) => ({
          unitType: item['Unit Type'],
          unitName: item['Unit Name'],
        }));

      await Type.insertMany(filteredData);
    }

    req.file.buffer = null;
    res.json({ error: false });
  } catch (error) {
    console.error(error);
    res.json({
      error: true,
    });
  }
};

exports.getTypes = async (req, res) => {
  try {
    const types = await Type.find({});

    res.json(types);
  } catch (error) {
    console.error(error);
    res.json({
      error: true,
    });
  }
};

exports.deleteTypes = async (req, res) => {
  try {
    await Type.deleteMany({});

    res.json({ error: false, message: 'Berhasil hapus semua data' });
  } catch (error) {
    console.error(error);
    res.json({
      error: true,
    });
  }
};