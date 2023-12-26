const xlsx = require('xlsx');
const Part = require('../models/Part');

exports.storeParts = async (req, res) => {
  try {
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { raw: true });

    const requiredColumns = ['Discontinue', 'Item number', 'Product name'];

    for (const column of requiredColumns) {
      if (!Object.keys(data[0]).includes(column)) {
        return res
          .status(400)
          .json({
            error: true,
            message: `Format kolom tidak sesuai.`,
          });
      }
    }

    const batchSize = 10;
    const totalRows = data.length;

    for (let start = 0; start < totalRows; start += batchSize) {
      const end = Math.min(start + batchSize, totalRows);
      const batchData = data.slice(start, end);

      const filteredData = batchData
        .filter((item) => item['Discontinue'] === 'No')
        .map((item) => ({
          partNumber: item['Item number'],
          partName: item['Product name'],
        }));

      await Part.insertMany(filteredData);
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

exports.getParts = async (req, res) => {
  try {
    const parts = await Part.find({});

    res.json(parts);
  } catch (error) {
    console.error(error);
    res.json({
      error: true,
    });
  }
};

exports.deleteParts = async (req, res) => {
  try {
    await Part.deleteMany({});

    res.json({ error: false, message: 'Berhasil hapus semua data' });
  } catch (error) {
    console.error(error);
    res.json({
      error: true,
    });
  }
};
