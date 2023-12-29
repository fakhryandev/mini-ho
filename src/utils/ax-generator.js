const ExcelJS = require('exceljs');
const Type = require('../models/Type');

const buildHeader = () => {
  const headers = [
    'kode 3',
    'KODE AX 5',
    'KODE AX 9',
    'NO AHASS',
    'Nomor Hotline',
    'Tgl PO',
    'Item',
    'Status',
    'Qty',
    'Nama',
    'KET',
    'KET OD/OP',
    'No POD',
    'TGL POD',
    'Note',
    'Upload',
  ];

  return headers;
};

const buildRow = async (item) => {
  const unitName = await Type.findOne({ unitType: item.type }).select(
    'unitName'
  );
  const upload = `${item.kodeax9};${item.nomor_request};${item.create_at};HTLNC; ;${item.part};${item.qty}; ;${item.nama};${item.alamat};${item.kota}; ;${unitName};${item.tahun};${item.telepon};N;N;${item.noka};${item.nosin};ho note: ${item.nomor_request}`;
  const rowData = [
    item.kode3,
    item.kodeax5,
    item.kodeax9,
    item.noAhass,
    item.nomor_request,
    item.create_at,
    item.part,
    'Aktif',
    1,
    item.nama.toUpperCase(),
    'HOTLINE NON CLAIM',
    '',
    '',
    item.create_at,
    item.nomor_request,
    upload,
  ];
  return rowData;
};

const axGenerator = (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.addRow(buildHeader());
  data.forEach((item) => {
    worksheet.addRow(buildRow(item));
  });

  return workbook;
};

module.exports = { axGenerator };
