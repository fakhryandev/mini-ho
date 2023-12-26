const ExcelJS = require('exceljs');

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

const buildRow = (item) => {
  const rowData = [
    'KODE3',
    'KODEAX5',
    'KODEAX9',
    'NOAHASS',
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
    'UPLOAD',
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
