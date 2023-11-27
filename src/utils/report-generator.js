const ExcelJS = require("exceljs");

const buildHeader = (maxPartsLength) => {
  const headers = [
    "Nomor",
    "Nama",
    "Nik",
    "Alamat",
    "Telepon",
    "Kota",
    "Noka",
    "Nosin",
  ];
  for (let i = 0; i < maxPartsLength.length; i++) {
    Headers.push(`Part Number ${i + 1}`, `QTY ${i + 1}`);
  }

  return headers;
};

const buildRow = (item, maxPartsLength) => {
  const rowData = [
    item.nomor,
    item.nama,
    item.nik,
    item.alamat,
    item.telepon,
    item.kota,
    item.noka,
    item.nosin,
  ];

  for (let i = 0; i < maxPartsLength; i++) {
    const part = item.parts && item.parts[i] ? item.parts[i] : {};
    rowData.push(part);
  }

  return rowData;
};

const generator = (data) => {
  const maxPartsLength = Math.max(
    ...data.map((item) => item.parts && item.parts.length)
  );

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Request Part");

  worksheet.addRow(buildHeader(maxPartsLength));

  data.forEach((item) => {
    worksheet.addRow(buildRow(item, maxPartsLength));
  });

  return workbook;
};

module.exports = { generator };
