const ExcelJS = require('exceljs');

const buildHeader = (_) => {
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
        '',
        '',
        '',
        '',
        item.nomor,
        ''

    ]

    return rowData
}

const axGenerator = (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.addRow(buildHeader());
//   data.forEach((item) => {
//     worksheet.addRow(buildRow(item))
//   });

  return workbook
};

module.exports = { axGenerator };
