const xlsx = require('xlsx');
const Part = require('../models/Part');

exports.storeParts = async (req, res) => {
  try {
    const bufferData = req.file.buffer;
    const workbook = xlsx.read(bufferData, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { raw: true });

    const requiredColumns = [
      'Is Blacklist HO?',
      'Item Id',
      'Item Name',
      'Max Qty HO',
    ];

    for (const column of requiredColumns) {
      if (!Object.keys(data[0]).includes(column)) {
        return res.status(400).json({
          error: true,
          message: `Format kolom tidak sesuai.`,
        });
      }
    }

    const batchSize = 1000;
    const totalRows = data.length;

    for (let start = 0; start < totalRows; start += batchSize) {
      const end = Math.min(start + batchSize, totalRows);
      const batchData = data.slice(start, end);

      const filteredData = batchData
        .filter(
          (item) =>
            item['Is Blacklist HO?'] === 'false' &&
            (item['Max Qty HO'] != 0 || item['Max Qty HO'].toString().trim() != '')
        )
        .map((item) => ({
          partNumber: item['Item Id'],
          partName: item['Item Name'],
          maxQty: parseInt(item['Max Qty HO']),
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
